// ===== Configuration Supabase =====
const SUPABASE_URL = 'https://oesnwduvjatwrckuaxpz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lc253ZHV2amF0d3Jja3VheHB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNzk3NDcsImV4cCI6MjA4Njc1NTc0N30.YNpqM2iHPsRzI_-4Pv6qIUvujQPHD-7vjGNYFrtoLWA';

// Initialiser le client Supabase
let supabase;
if (typeof window.supabaseClient === 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.supabaseClient = supabase;
} else {
    supabase = window.supabaseClient;
}

// ===== Elements DOM =====
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

// ===== Toggle entre Login et Signup =====
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
});

// ===== Fonction Toast =====
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== Fonction de chargement des boutons =====
function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (isLoading) {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
    } else {
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ===== Connexion avec Email/Password =====
loginFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    setButtonLoading(loginBtn, true);
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) throw error;
        
        showToast('Connexion reussie ! Redirection...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Erreur de connexion:', error);
        showToast(error.message || 'Erreur lors de la connexion', 'error');
        setButtonLoading(loginBtn, false);
    }
});

// ===== Inscription avec Email/Password =====
signupFormElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!agreeTerms) {
        showToast('Veuillez accepter les conditions d\'utilisation', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('Le mot de passe doit contenir au moins 8 caracteres', 'error');
        return;
    }
    
    setButtonLoading(signupBtn, true);
    
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });
        
        if (error) throw error;
        
        showToast('Compte cree ! Verifiez votre email pour confirmer votre inscription.', 'success');
        
        setTimeout(() => {
            signupForm.classList.remove('active');
            loginForm.classList.add('active');
            signupFormElement.reset();
            setButtonLoading(signupBtn, false);
        }, 2000);
        
    } catch (error) {
        console.error('Erreur d\'inscription:', error);
        showToast(error.message || 'Erreur lors de l\'inscription', 'error');
        setButtonLoading(signupBtn, false);
    }
});

// ===== Connexion avec Google =====
async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/PlanFlow/dashboard.html`
            }
        });
        
        if (error) throw error;
        
    } catch (error) {
        console.error('Erreur de connexion Google:', error);
        showToast('Erreur lors de la connexion avec Google', 'error');
    }
}

googleLoginBtn.addEventListener('click', signInWithGoogle);
googleSignupBtn.addEventListener('click', signInWithGoogle);

// ===== Gestion du mot de passe oublie =====
document.querySelector('.forgot-password').addEventListener('click', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    
    if (!email) {
        showToast('Veuillez entrer votre email dans le champ ci-dessus', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/PlanFlow/reset-password.html`,
        });
        
        if (error) throw error;
        
        showToast('Email de reinitialisation envoye ! Verifiez votre boite mail.', 'success');
        
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'envoi de l\'email', 'error');
    }
});

// ===== Verifier si l'utilisateur est deja connecte =====
async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        window.location.href = 'dashboard.html';
    }
}

checkSession();

// ===== Ecouter les changements d'authentification =====
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    
    if (event === 'SIGNED_IN') {
        console.log('User signed in:', session.user);
    }
    
    if (event === 'SIGNED_OUT') {
        console.log('User signed out');
    }
    
    if (event === 'USER_UPDATED') {
        console.log('User updated:', session.user);
    }
});

// ===== Validation en temps reel =====
document.getElementById('loginEmail').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#F56565';
    } else {
        this.style.borderColor = '';
    }
});

document.getElementById('signupEmail').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#F56565';
    } else {
        this.style.borderColor = '';
    }
});

document.getElementById('signupPassword').addEventListener('input', function() {
    const hint = this.nextElementSibling;
    if (this.value.length < 8 && this.value.length > 0) {
        hint.style.color = '#F56565';
    } else if (this.value.length >= 8) {
        hint.style.color = '#48BB78';
    } else {
        hint.style.color = '';
    }
});

console.log('%cPlanFlow Auth System', 'font-size: 16px; color: #667EEA; font-weight: bold;');
console.log('%cSupabase connecte avec succes', 'font-size: 12px; color: #48BB78;');
