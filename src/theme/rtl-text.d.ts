import 'react-native';

declare module 'react-native' {
  interface TextProps {
    dir?: 'ltr' | 'rtl' | 'auto';
  }
}
