import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

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
    padding: 50,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10,
    letterSpacing: -0.5,
    lineHeight: 1.2,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#6b7280',
    fontSize: 9,
  },
  contactItem: {
    marginRight: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  summary: {
    color: '#4b5563',
  },
  experienceItem: {
    marginBottom: 15,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontWeight: 600,
    color: '#111827',
    fontSize: 11,
    flex: 1,
    paddingRight: 10,
  },
  role: {
    color: '#6b7280',
    flex: 1,
    paddingRight: 10,
  },
  date: {
    fontSize: 9,
    color: '#9ca3af',
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 4,
  },
  bulletPoint: {
    width: 10,
    color: '#9ca3af',
  },
  bulletText: {
    flex: 1,
    color: '#4b5563',
  },
  skillsGroup: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  skillCategory: {
    fontWeight: 600,
    width: 80,
    color: '#111827',
  },
  skillItems: {
    flex: 1,
    color: '#4b5563',
  }
});

export default function MinimalistTemplate({ data }: { data: any }) {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.fullName || 'Untitled'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>}
          </View>
        </View>

        {personalInfo?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp: any, i: number) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{exp.company}</Text>
                  <Text style={styles.date}>{exp.startDate} - {exp.endDate}</Text>
                </View>
                <View style={styles.expHeader}>
                  <Text style={styles.role}>{exp.role}</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj: any, i: number) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{proj.name} {proj.technologies ? `- ${proj.technologies}` : ''}</Text>
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

        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skillGroup: any, i: number) => (
              <View key={i} style={styles.skillsGroup}>
                <Text style={styles.skillCategory}>{skillGroup.category}</Text>
                <Text style={styles.skillItems}>{skillGroup.items.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{edu.school}</Text>
                  <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <View style={styles.expHeader}>
                  <Text style={styles.role}>{edu.degree} {edu.cgpa ? `(CGPA: ${edu.cgpa})` : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}
