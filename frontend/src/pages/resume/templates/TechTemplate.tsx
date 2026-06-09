import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Courier',
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.4,
  },
  header: {
    backgroundColor: '#1e293b',
    padding: 20,
    marginBottom: 20,
    borderRadius: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Courier-Bold',
    color: '#10b981', // Emerald green
    marginBottom: 15,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    color: '#94a3b8',
    fontSize: 9,
  },
  contactItem: {
    marginRight: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Courier-Bold',
    color: '#1e293b',
    backgroundColor: '#f1f5f9',
    padding: 4,
    paddingLeft: 8,
    marginBottom: 10,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  summary: {
    marginBottom: 10,
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
    fontFamily: 'Courier-Bold',
    fontSize: 11,
    color: '#1e293b',
    flex: 1,
    paddingRight: 10,
  },
  role: {
    color: '#475569',
    flex: 1,
    paddingRight: 10,
  },
  date: {
    fontSize: 9,
    color: '#64748b',
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 2,
  },
  bulletPoint: {
    width: 15,
    color: '#10b981',
    fontFamily: 'Courier-Bold',
  },
  bulletText: {
    flex: 1,
  },
  skillsGroup: {
    marginBottom: 4,
  },
  skillCategory: {
    fontFamily: 'Courier-Bold',
    color: '#1e293b',
  }
});

export default function TechTemplate({ data }: { data: any }) {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.fullName || 'Untitled'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo?.email && <Text style={styles.contactItem}>[email: {personalInfo.email}]</Text>}
            {personalInfo?.phone && <Text style={styles.contactItem}>[tel: {personalInfo.phone}]</Text>}
            {personalInfo?.github && <Text style={styles.contactItem}>[git: {personalInfo.github}]</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactItem}>[in: {personalInfo.linkedin}]</Text>}
          </View>
        </View>

        {personalInfo?.summary && (
          <View>
            <Text style={styles.sectionTitle}>~/summary</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {skills && skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>~/skills</Text>
            {skills.map((skillGroup: any, i: number) => (
              <View key={i} style={styles.skillsGroup}>
                <Text>
                  <Text style={styles.skillCategory}>{skillGroup.category}: </Text>
                  <Text>{skillGroup.items.join(', ')}</Text>
                </Text>
              </View>
            ))}
          </View>
        )}

        {experience && experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>~/experience</Text>
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
                    <Text style={styles.bulletPoint}>{'>'}</Text>
                    <Text style={styles.bulletText}>{exp.description}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {projects && projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>~/projects</Text>
            {projects.map((proj: any, i: number) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{proj.name} {proj.technologies ? `| ${proj.technologies}` : ''}</Text>
                </View>
                {proj.description && (
                  <View style={styles.bullet}>
                    <Text style={styles.bulletPoint}>{'>'}</Text>
                    <Text style={styles.bulletText}>{proj.description}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>~/certifications</Text>
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
            <Text style={styles.sectionTitle}>~/education</Text>
            {education.map((edu: any, i: number) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{edu.school}</Text>
                  <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                </View>
                <View style={styles.expHeader}>
                  <Text style={styles.role}>{edu.degree} {edu.cgpa ? `| CGPA: ${edu.cgpa}` : ''}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}
