import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginBottom: 5,
    letterSpacing: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    fontSize: 10,
  },
  contactItem: {
    marginHorizontal: 5,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginTop: 15,
    marginBottom: 10,
  },
  summary: {
    textAlign: 'justify',
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
    fontFamily: 'Times-Bold',
    fontSize: 12,
    flex: 1,
    paddingRight: 10,
  },
  role: {
    fontFamily: 'Times-Italic',
    fontSize: 11,
    flex: 1,
    paddingRight: 10,
  },
  date: {
    fontSize: 10,
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 3,
  },
  bulletPoint: {
    width: 15,
    fontSize: 11,
  },
  bulletText: {
    flex: 1,
    textAlign: 'justify',
  },
  skillsGroup: {
    marginBottom: 4,
  },
  skillCategory: {
    fontFamily: 'Times-Bold',
  }
});

export default function ExecutiveTemplate({ data }: { data: any }) {
  const { personalInfo, education, experience, projects, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.fullName || 'Untitled'}</Text>
          <View style={styles.contactInfo}>
            {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactItem}>| {personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactItem}>| {personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactItem}>| {personalInfo.linkedin}</Text>}
          </View>
        </View>

        {/* Professional Summary */}
        {personalInfo?.summary && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
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
                    <Text style={styles.bulletPoint}>-</Text>
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
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj: any, i: number) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.company}>{proj.name} {proj.technologies ? `| ${proj.technologies}` : ''}</Text>
                </View>
                {proj.description && (
                  <View style={styles.bullet}>
                    <Text style={styles.bulletPoint}>-</Text>
                    <Text style={styles.bulletText}>{proj.description}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Core Competencies</Text>
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

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications & Licenses</Text>
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

      </Page>
    </Document>
  );
}
