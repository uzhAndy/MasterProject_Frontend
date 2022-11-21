import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});


export interface Summary {
    title: string,
    description: string,
}

interface IDocProps {
    sentiment: string,
    sentimentQuality: number,
    transcript: string,
    summary: Summary[],
}

// Create Document Component
const MyDocument = (props: IDocProps) => {

    return(
    <Document>
        <Page size="A4" style={styles.page}>
            {props.summary.map((finTerm) => {
            return(
                <View key={finTerm.title} style={styles.section}>
                    <Text style={{ marginBottom: "10px", }}>
                        {finTerm.title}
                    </Text>
                    <Text style={{ marginBottom: "25px", fontSize: "11px" }}>
                        {finTerm.description}
                    </Text>
                </View>
            )})}
            
        
        </Page>
    </Document>
    )
};

export default MyDocument