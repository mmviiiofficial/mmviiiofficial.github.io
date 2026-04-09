import './style.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Fractal Grid rendering
  const fractalGrid = document.getElementById('fractalGrid');
  if (fractalGrid) {
    for (let i = 1; i <= 8; i++) {
      const fractalBlock = document.createElement('div');
      fractalBlock.className = 'fractal-block';
      fractalBlock.textContent = `FRC-${i}`;
      fractalGrid.appendChild(fractalBlock);
    }
  }

  // Hero Title subtle shifting
  const heroSpan = document.querySelector('.hero h1 span');
  if (heroSpan) {
    heroSpan.style.transition = 'color 0.5s ease';
    setInterval(() => {
      heroSpan.style.color = heroSpan.style.color === 'var(--primary-400)' 
        ? 'var(--primary-600)' 
        : 'var(--primary-400)';
    }, 3000);
  }

  // Auth Modal Logic
  const authModal = document.getElementById('authModal');
  const openAuthBtn = document.getElementById('openAuthBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const authForm = document.getElementById('authForm');
  const toggleAuthModeBtn = document.getElementById('toggleAuthMode');
  const modalTitle = document.getElementById('modalTitle');
  const submitAuthBtn = document.getElementById('submitAuthBtn');
  const authMessage = document.getElementById('authMessage');

  let isSignUpMode = false;

  const toggleModal = () => {
    if(authModal) {
      if(authModal.classList.contains('active')) {
        authModal.classList.remove('active');
        // also hide nav links on mobile if open
        navLinks.classList.remove('active');
      } else {
        authModal.style.display = 'flex';
        // mini timeout to allow display:flex to apply before opacity transition
        setTimeout(() => authModal.classList.add('active'), 10);
      }
    }
  };

  if(openAuthBtn) openAuthBtn.addEventListener('click', toggleModal);
  if(closeModalBtn) closeModalBtn.addEventListener('click', toggleModal);

  if(toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', () => {
      isSignUpMode = !isSignUpMode;
      authMessage.textContent = '';
      if(isSignUpMode) {
        modalTitle.textContent = "Forge Nexus";
        submitAuthBtn.textContent = "Sign Up";
        toggleAuthModeBtn.textContent = "Access Portal (Login)";
      } else {
        modalTitle.textContent = "Access Portal";
        submitAuthBtn.textContent = "Initialize Sequence";
        toggleAuthModeBtn.textContent = "Forge new Nexus (Sign Up)";
      }
    });
  }

  if(authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authMessage.textContent = "Processing Biometrics...";
      authMessage.className = "auth-message";

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        let error = null;
        if(isSignUpMode) {
          const { error: signUpError } = await supabase.auth.signUp({ email, password });
          error = signUpError;
        } else {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          error = signInError;
        }

        if(error) {
          authMessage.textContent = "Denial: " + error.message;
          authMessage.className = "auth-message error";
        } else {
          authMessage.textContent = isSignUpMode 
            ? "Nexus forged successfully. Awaiting verification." 
            : "Access Granted.";
          authMessage.className = "auth-message success";
          setTimeout(toggleModal, 2000);
        }
      } catch (err) {
        authMessage.textContent = "Critical System Failure.";
        authMessage.className = "auth-message error";
      }
    });
  }
});

