import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCRfw0uNxq7OMYLokj3cQUyc_PZP7Hxd7I",
  authDomain: "marketing-analytics-e0743.firebaseapp.com",
  projectId: "marketing-analytics",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);

window.recaptchaVerifier = new RecaptchaVerifier(
  auth, 
  'recaptcha-container', 
  { size: 'invisible' }
);