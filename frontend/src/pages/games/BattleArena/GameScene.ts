import Phaser from 'phaser';
import { Socket } from 'socket.io-client';

export default class GameScene extends Phaser.Scene {
  private socket!: Socket;
  private roomId!: string;
  private meId!: string;

  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;
  
  private otherPlayers: Record<string, Phaser.GameObjects.Sprite> = {};
  private otherPlayerNames: Record<string, Phaser.GameObjects.Text> = {};
  
  private bullets!: Phaser.Physics.Arcade.Group;
  
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  
  private mobileMove: 'left' | 'right' | 'stop' = 'stop';
  private triggerJumpFlag: boolean = false;
  private triggerShootFlag: boolean = false;

  private lastFireTime: number = 0;
  private isDead: boolean = false;

  constructor() {
    super('GameScene');
  }

  initNetwork(socket: Socket, roomId: string, user: any) {
    this.socket = socket;
    this.roomId = roomId;

    this.socket.emit('ba-join', { roomId, user });

    this.socket.on('ba-init', (data: any) => {
      this.meId = data.me;
      const meData = data.players[this.meId];
      if (meData) {
        this.player.setPosition(meData.x, meData.y);
        this.player.setTint(meData.color);
      }

      for (const id in data.players) {
        if (id !== this.meId) {
          this.addOtherPlayer(data.players[id]);
        }
      }
    });

    this.socket.on('ba-player-joined', (pData: any) => {
      if (pData.id !== this.meId) {
        this.addOtherPlayer(pData);
      }
    });

    this.socket.on('ba-player-left', (id: string) => {
      if (this.otherPlayers[id]) {
        this.otherPlayers[id].destroy();
        delete this.otherPlayers[id];
      }
      if (this.otherPlayerNames[id]) {
        this.otherPlayerNames[id].destroy();
        delete this.otherPlayerNames[id];
      }
    });

    this.socket.on('ba-player-moved', (pData: any) => {
      const p = this.otherPlayers[pData.id];
      if (p) {
        // Simple interpolation could be added here. For now, direct teleport.
        p.setPosition(pData.x, pData.y);
        p.setFlipX(pData.facing === 'left');
        
        const nameText = this.otherPlayerNames[pData.id];
        if (nameText) {
          nameText.setPosition(pData.x - nameText.width/2, pData.y - 30);
        }
      }
    });

    this.socket.on('ba-player-shot', (data: any) => {
      this.spawnBullet(data.x, data.y, data.vx, data.vy, data.color);
    });

    this.socket.on('ba-health-changed', (data: any) => {
      if (data.id === this.meId) {
        this.events.emit('health-changed', data.health);
      }
    });

    this.socket.on('ba-player-died', (data: any) => {
      if (data.victimId === this.meId) {
        this.isDead = true;
        this.player.setVisible(false);
        this.events.emit('deaths-changed', data.victimDeaths);
      } else {
        const p = this.otherPlayers[data.victimId];
        if (p) p.setVisible(false);
        const name = this.otherPlayerNames[data.victimId];
        if (name) name.setVisible(false);
      }

      if (data.killerId === this.meId) {
        this.events.emit('kills-changed', data.killerKills);
      }
    });

    this.socket.on('ba-player-respawned', (data: any) => {
      if (data.id === this.meId) {
        this.isDead = false;
        this.player.setPosition(data.x, data.y);
        this.player.setVisible(true);
        this.events.emit('health-changed', data.health);
      } else {
        const p = this.otherPlayers[data.id];
        if (p) {
          p.setPosition(data.x, data.y);
          p.setVisible(true);
        }
        const name = this.otherPlayerNames[data.id];
        if (name) name.setVisible(true);
      }
    });
  }

  preload() {
    // Generate placeholder textures programmatically
    const graphics = this.add.graphics();
    
    // Player Rectangle (32x48)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(0, 0, 32, 48);
    graphics.generateTexture('player', 32, 48);
    graphics.clear();

    // Bullet (8x8)
    graphics.fillStyle(0xfff000, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('bullet', 8, 8);
    graphics.clear();

    // Platform (400x32)
    graphics.fillStyle(0x475569, 1); // slate-600
    graphics.fillRect(0, 0, 400, 32);
    graphics.generateTexture('platform', 400, 32);
    graphics.clear();

    // Ground (800x64)
    graphics.fillStyle(0x334155, 1); // slate-700
    graphics.fillRect(0, 0, 800, 64);
    graphics.generateTexture('ground', 800, 64);
    graphics.clear();
  }

  create() {
    // Bounds
    this.physics.world.setBounds(0, 0, 800, 600);

    // Platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    // Player
    this.player = this.physics.add.sprite(400, 100, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // Bullets
    this.bullets = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      defaultKey: 'bullet',
      maxSize: 50,
      runChildUpdate: true
    });
    this.physics.add.collider(this.bullets, this.platforms, (b: any) => {
      b.setActive(false);
      b.setVisible(false);
      b.body.stop();
    });

    // Inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE
      });
    }
  }

  addOtherPlayer(pData: any) {
    const p = this.add.sprite(pData.x, pData.y, 'player');
    p.setTint(pData.color);
    if (pData.isDead) p.setVisible(false);
    this.otherPlayers[pData.id] = p;

    const nameText = this.add.text(pData.x, pData.y - 30, pData.name, {
      fontSize: '12px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 2, y: 2 }
    });
    if (pData.isDead) nameText.setVisible(false);
    this.otherPlayerNames[pData.id] = nameText;
  }

  setMobileMove(dir: 'left' | 'right' | 'stop') {
    this.mobileMove = dir;
  }
  
  triggerJump() {
    this.triggerJumpFlag = true;
  }
  
  triggerShoot() {
    this.triggerShootFlag = true;
  }

  spawnBullet(x: number, y: number, vx: number, vy: number, color: number = 0xffffff) {
    const bullet = this.bullets.get(x, y);
    if (bullet) {
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.setTint(color);
      // Ensure physics body is active and ignores gravity
      bullet.body.allowGravity = false;
      bullet.body.reset(x, y);
      bullet.setVelocity(vx, vy);

      // Auto destroy after 2 seconds
      this.time.delayedCall(2000, () => {
        if (bullet.active) {
          bullet.setActive(false);
          bullet.setVisible(false);
          bullet.body.stop();
        }
      });
    }
    return bullet;
  }

  fire() {
    if (this.isDead || !this.meId) return;
    const now = this.time.now;
    if (now - this.lastFireTime < 250) return; // Fire rate limit

    this.lastFireTime = now;

    const isLeft = this.player.flipX;
    const vx = isLeft ? -800 : 800;
    const x = isLeft ? this.player.x - 20 : this.player.x + 20;
    const y = this.player.y;

    const bullet = this.spawnBullet(x, y, vx, 0, this.player.tintTopLeft);

    // Tell server we shot
    this.socket?.emit('ba-shoot', {
      roomId: this.roomId,
      bulletData: { x, y, vx, vy: 0, color: this.player.tintTopLeft }
    });

    // Check hit immediately on our client for responsiveness
    // Since we are doing a trusted-client MVP hit detection:
    for (const id in this.otherPlayers) {
      const p = this.otherPlayers[id];
      if (p.visible && Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), p.getBounds())) {
        // Hit!
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.stop();

        this.socket?.emit('ba-hit', {
          roomId: this.roomId,
          targetId: id,
          damage: 25 // base pistol damage
        });
        break; // bullet destroyed
      }
    }
  }

  update() {
    if (this.isDead) return;
    if (!this.player || !this.player.body) return;

    // Movement
    let isMovingLeft = (this.cursors.left.isDown || this.wasd.left.isDown || this.mobileMove === 'left');
    let isMovingRight = (this.cursors.right.isDown || this.wasd.right.isDown || this.mobileMove === 'right');
    let isJumping = (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up) || this.triggerJumpFlag);
    let isShooting = (Phaser.Input.Keyboard.JustDown(this.cursors.space) || this.wasd.space.isDown || this.triggerShootFlag);

    if (this.triggerJumpFlag) this.triggerJumpFlag = false;
    if (this.triggerShootFlag) this.triggerShootFlag = false;

    if (isMovingLeft) {
      this.player.setVelocityX(-300);
      this.player.setFlipX(true);
    } else if (isMovingRight) {
      this.player.setVelocityX(300);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (isJumping && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    if (isShooting) {
      this.fire();
    }

    // Network Sync
    if (this.socket && this.meId) {
      this.socket.emit('ba-player-update', {
        roomId: this.roomId,
        state: {
          x: this.player.x,
          y: this.player.y,
          vx: this.player.body.velocity.x,
          vy: this.player.body.velocity.y,
          facing: this.player.flipX ? 'left' : 'right'
        }
      });
    }

    // Check overlaps of active bullets (very basic hit detection)
    this.bullets.getChildren().forEach((b: any) => {
      if (b.active) {
        for (const id in this.otherPlayers) {
          const p = this.otherPlayers[id];
          if (p.visible && Phaser.Geom.Intersects.RectangleToRectangle(b.getBounds(), p.getBounds())) {
            b.setActive(false);
            b.setVisible(false);
            b.body.stop();
            // Don't emit hit here to avoid multiple emits if bullet is alive for 1 frame inside.
            // Actually, we only emit if WE fired it. We already check that inside `fire()`.
            // Wait, we can't reliably know who fired it if we didn't store shooter ID on the bullet.
            // If someone else fired it and it hits another person, let THEIR client report it.
          }
        }
      }
    });
  }
}
