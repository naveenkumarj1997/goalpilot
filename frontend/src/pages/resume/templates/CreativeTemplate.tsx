import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: '#333',
  },
  leftColumn: {
    width: '40%',
    backgroundColor: '#f3f4f6',
    padding: 30,
    height: '100%',
  },
  rightColumn: {
    width: '60%',
    padding: 30,
    height: '100%',
  },
  nameBox: {
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: '#8b5cf6', // Purple accent
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  roleTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#4b5563',
    marginTop: 5,
  },
  sectionTitleLeft: {
    fontSize: 12,
    fontWeight: 700,
    color: '#8b5cf6',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sectionTitleRight: {
    fontSize: 14,
    fontWeight: 700,
    color: '#8b5cf6',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 15,
    textTransform: 'uppercase',
  },
  contactItem: {
    marginBottom: 8,
    fontSize: 9,
    color: '#4b5563',
  },
  skillCategory: {
    fontWeight: 700,
    fontSize: 10,
    marginTop: 8,
    marginBottom: 4,
    color: '#1f2937',
  },
  skillItem: {
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 2,
  },
  summary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#4b5563',
  },
  experienceItem: {
    marginBottom: 12,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontWeight: 700,
    fontSize: 11,
    color: '#1f2937',
    flex: 1,
    paddingRight: 10,
  },
  role: {
    fontWeight: 600,
    color: '#4b5563',
    flex: 1,
    paddingRight: 10,
  },
  date: {
    fontSize: 9,
    color: '#6b7280',
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 4,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
    color: '#8b5cf6',
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.4,
  }
});

export default function CreativeTemplate({ data }: { data: any }) {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Left Column */}
        <View style={styles.leftColumn}>
          <View style={styles.nameBox}>
            <Text style={styles.name}>{personalInfo?.fullName || 'Untitled'}</Text>
            {data.targetRole && <Text style={styles.roleTitle}>{data.targetRole}</Text>}
          </View>

          <Text style={styles.sectionTitleLeft}>Contact</Text>
          {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
          {personalInfo?.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
          {personalInfo?.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
          {personalInfo?.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
          {personalInfo?.github && <Text style={styles.contactItem}>{personalInfo.github}</Text>}

          {skills && skills.length > 0 && (
            <View>
              <Text style={styles.sectionTitleLeft}>Skills</Text>
              {skills.map((skillGroup: any, i: number) => (
                <View key={i}>
                  <Text style={styles.skillCategory}>{skillGroup.category}</Text>
                  {skillGroup.items.map((item: string, j: number) => (
                    <Text key={j} style={styles.skillItem}>• {item}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          
          {personalInfo?.summary && (
            <View>
              <Text style={[styles.sectionTitleRight, { marginTop: 0 }]}>Profile</Text>
              <Text style={styles.summary}>{personalInfo.summary}</Text>
            </View>
          )}

          {experience && experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitleRight}>Experience</Text>
              {experience.map((exp: any, i: number) => (
                <View key={i} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.company}>{exp.company}</Text>
                    <Text style={styles.date}>{exp.startDate} - {exp.endDate}</Text>
                  </View>
                  <View style={styles.expHeader}>
                    <Text style={styles.role}>{exp.role}</Text>
                    {exp.location && <Text style={styles.date}>{exp.location}</Text>}
                  </View>
                  {exp.description && (
                    <View style={styles.bullet}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{exp.description}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {projects && projects.length > 0 && (
            <View>
              <Text style={styles.sectionTitleRight}>Projects</Text>
              {projects.map((proj: any, i: number) => (
                <View key={i} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.company}>{proj.name} {proj.technologies ? `| ${proj.technologies}` : ''}</Text>
                  </View>
                  {proj.description && (
                    <View style={styles.bullet}>
                      <Text style={styles.bulletPoint}>•</Text>
                      <Text style={styles.bulletText}>{proj.description}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {data.certifications && data.certifications.length > 0 && (
            <View>
              <Text style={styles.sectionTitleRight}>Certifications</Text>
              {data.certifications.map((cert: any, i: number) => (
                <View key={i} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.company}>{cert.name}</Text>
                    <Text style={styles.date}>{cert.date}</Text>
                  </View>
                  <View style={styles.expHeader}>
                    <Text style={styles.role}>{cert.issuer}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {education && education.length > 0 && (
            <View>
              <Text style={styles.sectionTitleRight}>Education</Text>
              {education.map((edu: any, i: number) => (
                <View key={i} style={styles.experienceItem}>
                  <View style={styles.expHeader}>
                    <Text style={styles.company}>{edu.school}</Text>
                    <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                  </View>
                  <View style={styles.expHeader}>
                    <Text style={styles.role}>{edu.degree}</Text>
                    {edu.cgpa && <Text style={styles.date}>CGPA: {edu.cgpa}</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}

        </View>
      </Page>
    </Document>
  );
}
