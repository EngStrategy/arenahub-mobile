import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PasswordStrengthProps {
  password: string;
  showDetails?: boolean;
}

interface PasswordCriteria {
  text: string;
  met: boolean;
}

export function PasswordStrength({ password, showDetails = true }: PasswordStrengthProps) {
  const evaluatePassword = () => {
    let score = 0;
    const criteria: PasswordCriteria[] = [
      { text: 'Pelo menos 8 caracteres', met: password.length >= 8 },
      { text: 'Pelo menos um número', met: /\d/.test(password) },
      {
        text: 'Letras maiúsculas e minúsculas',
        met: /[a-z]/.test(password) && /[A-Z]/.test(password),
      },
      { text: 'Pelo menos um caractere especial', met: /[^A-Za-z0-9]/.test(password) },
    ];

    criteria.forEach((criterion) => {
      if (criterion.met) score += 25;
    });

    return { score, criteria };
  };

  const { score, criteria } = evaluatePassword();

  let color = '#ef4444'; // red
  let text = 'Fraca';
  let barColor = '#ef4444';

  if (score >= 75) {
    color = '#22c55e'; // green
    text = 'Forte';
    barColor = '#22c55e';
  } else if (score >= 50) {
    color = '#f59e0b'; // orange
    text = 'Média';
    barColor = '#f59e0b';
  }

  if (!password) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              { width: `${score}%`, backgroundColor: barColor },
            ]}
          />
        </View>
        <Text style={[styles.strengthText, { color }]}>{text}</Text>
      </View>

      {/* Detalhes dos Critérios */}
      {showDetails && (
        <View style={styles.criteriaContainer}>
          {criteria.map((criterion, index) => (
            <View key={index} style={styles.criteriaItem}>
              <Ionicons
                name={criterion.met ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={criterion.met ? '#22c55e' : '#9ca3af'}
              />
              <Text
                style={[
                  styles.criteriaText,
                  criterion.met && styles.criteriaTextMet,
                ]}
              >
                {criterion.text}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  criteriaContainer: {
    gap: 8,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  criteriaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  criteriaTextMet: {
    color: '#22c55e',
  },
});