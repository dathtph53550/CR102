import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface FilterSegmentProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  label?: string;
}

const FilterSegment = ({
  options,
  selectedOption,
  onSelect,
  label,
}: FilterSegmentProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.segmentContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.segment,
                selectedOption === option && styles.selectedSegment,
              ]}
              onPress={() => onSelect(option)}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedOption === option && styles.selectedSegmentText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  segmentContainer: {
    flexDirection: 'row',
  },
  segment: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  selectedSegment: {
    backgroundColor: '#3498db',
  },
  segmentText: {
    color: '#555',
    fontWeight: '500',
  },
  selectedSegmentText: {
    color: 'white',
  },
});

export default FilterSegment; 