import React from 'react';
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
    padding: 40,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#4b5563',
  },
  contactItem: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1e3a8a',
    marginTop: 15,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  summary: {
    marginBottom: 10,
  },
  experienceItem: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  company: {
    fontWeight: 700,
    fontSize: 11,
  },
  role: {
    fontWeight: 600,
    fontStyle: 'italic',
    color: '#4b5563',
  },
  date: {
    fontSize: 9,
    color: '#6b7280',
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
  },
  skillsGroup: {
    marginBottom: 5,
  },
  skillCategory: {
    fontWeight: 700,
    marginRight: 5,
  },
  skillList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});

export default function ModernTemplate({ data }: { data: any }) {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>• {personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>• {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactItem}>• {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text style={styles.contactItem}>• {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
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

        {/* Education */}
        {education && education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
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

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
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

      </Page>
    </Document>
  );
}
