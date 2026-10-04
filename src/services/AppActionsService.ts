import { Linking, Share } from 'react-native';

const STORE_URL = 'https://play.google.com/store/apps/details?id=com.bashirmanafikhi.sabiqoo';
const FEEDBACK_EMAIL = 'bashir.manafikhi@gmail.com';

export class AppActionsService {
  static async rateApp() {
    try {
      await Linking.openURL(STORE_URL);
    } catch (e) {
      console.warn('Unable to open store URL', e);
    }
  }

  static async shareApp() {
    try {
      const message = `جرب تطبيق سابقوا لأفكار الأعمال الصالحة: \n${STORE_URL}`;
      await Share.share({ message });
    } catch (e) {
      console.warn('Unable to share app', e);
    }
  }

  static async sendFeedback() {
    try {
      const subject = encodeURIComponent('ملاحظات حول تطبيق سابقوا');
      const body = encodeURIComponent('السلام عليكم،\n\nلدي الملاحظات التالية:\n\n');
      const mailUrl = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`;
      await Linking.openURL(mailUrl);
    } catch (e) {
      console.warn('Unable to open email app', e);
    }
  }
}
