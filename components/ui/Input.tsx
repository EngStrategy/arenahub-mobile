import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
}

export function Input({
  label,
  error,
  secureTextEntry = false,
  showPasswordToggle = false,
  style,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            error && styles.inputError,
            showPasswordToggle && styles.inputWithIcon,
            style,
          ]}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1f2937',
  },
  inputWithIcon: {
    paddingRight: 48,
  },
  inputFocused: {
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
});