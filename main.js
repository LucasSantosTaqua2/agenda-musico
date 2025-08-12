import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  setDoc,
  getDoc,
  where,
  getDocs,
  deleteField,
} from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';

// Inicializa os ícones e o Firebase uma única vez
lucide.createIcons();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

// --- Dicionários de Configuração ---
const statusMap = {
  confirmado: { text: 'Confirmado', color: 'bg-green-500/20 text-green-300' },
  aguardando: { text: 'Aguardando', color: 'bg-yellow-500/20 text-yellow-300' },
  cancelado: { text: 'Cancelado', color: 'bg-red-500/20 text-red-300' },
  realizado: { text: 'Realizado', color: 'bg-blue-500/20 text-blue-300' },
};

const eventTypes = {
  show: {
    text: 'Show',
    icon: 'music',
    color: 'text-purple-300',
    calendarBg: 'bg-purple-500',
  },
  ensaio: {
    text: 'Ensaio',
    icon: 'users',
    color: 'text-amber-300',
    calendarBg: 'bg-amber-500',
  },
  entrevista: {
    text: 'Entrevista',
    icon: 'mic',
    color: 'text-emerald-300',
    calendarBg: 'bg-emerald-500',
  },
  gravacao: {
    text: 'Gravação',
    icon: 'disc',
    color: 'text-blue-300',
    calendarBg: 'bg-blue-500',
  },
  viagem: {
    text: 'Viagem',
    icon: 'plane',
    color: 'text-indigo-300',
    calendarBg: 'bg-indigo-500',
  },
};

const forgotPasswordBtn = document.getElementById('forgot-password-btn');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const cancelForgotBtn = document.getElementById('cancel-forgot-btn');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotEmailInput = document.getElementById('forgot-email');
const forgotFeedback = document.getElementById('forgot-feedback');

forgotPasswordBtn.addEventListener('click', () => {
  forgotPasswordModal.classList.add('is-open');
});

cancelForgotBtn.addEventListener('click', () => {
  forgotPasswordModal.classList.remove('is-open');
  forgotFeedback.classList.add('hidden');
  forgotFeedback.textContent = '';
});

forgotPasswordForm.addEventListener('submit', async e => {
  e.preventDefault();
  const email = forgotEmailInput.value;

  try {
    await sendPasswordResetEmail(auth, email);
    forgotFeedback.textContent =
      'E-mail de redefinição enviado com sucesso! Verifique sua caixa de entrada.';
    forgotFeedback.className = 'text-sm mt-4 text-green-400';
    forgotFeedback.classList.remove('hidden');
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição:', error);
    forgotFeedback.textContent =
      'Erro ao enviar e-mail. Verifique se o e-mail está correto.';
    forgotFeedback.className = 'text-sm mt-4 text-red-400';
    forgotFeedback.classList.remove('hidden');
  }
});

// --- Constantes para Elementos do DOM ---
const loginScreen = document.getElementById('login-screen');
const loginContainer = document.getElementById('login-container');
const loadingAuth = document.getElementById('loading-auth');
const appContent = document.getElementById('app-content');
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const errorBanner = document.getElementById('error-banner');
const tabRider = document.getElementById('tab-rider');
const viewRider = document.getElementById('view-rider');
const riderModal = document.getElementById('rider-modal');

const showsListAgendados = document.getElementById('shows-list-agendados');
const showsListRealizados = document.getElementById('shows-list-realizados');
const loadingState = document.getElementById('loading-state');
const emptyState = document.getElementById('empty-state');
const filterArtistInput = document.getElementById('filter-artist');
const filterLocationInput = document.getElementById('filter-location');

const addModal = document.getElementById('add-modal');
const openAddModalBtn = document.getElementById('open-add-modal-btn');
const openAddRiderModalBtn = document.getElementById('open-add-rider-modal-btn'); // <-- ADICIONE ESTA LINHA
const deleteModal = document.getElementById('confirmation-modal');
const riderForm = document.getElementById('rider-form');
const cancelRiderBtn = document.getElementById('cancel-rider-btn');
const addChannelBtn = document.getElementById('add-channel-btn');
const ridersList = document.getElementById('riders-list');
const riderChannelsContainer = document.getElementById('rider-channels-container');
const editModal = document.getElementById('edit-modal');
const confirmStatusModal = document.getElementById('confirm-status-modal');
const setlistModal = document.getElementById('setlist-modal');
const showDetailsModal = document.getElementById('show-details-modal');

const tabAgenda = document.getElementById('tab-agenda');
const tabCalendario = document.getElementById('tab-calendario');
const tabSetlists = document.getElementById('tab-setlists');
const tabDashboard = document.getElementById('tab-dashboard');
const tabConfiguracoes = document.getElementById('tab-configuracoes');
const viewAgenda = document.getElementById('view-agenda');
const viewCalendario = document.getElementById('view-calendario');
const viewSetlists = document.getElementById('view-setlists');
const viewDashboard = document.getElementById('view-dashboard');
const viewConfiguracoes = document.getElementById('view-configuracoes');
const tabEquipe = document.getElementById('tab-equipe');
const viewEquipe = document.getElementById('view-equipe');
const equipeModal = document.getElementById('equipe-modal');

const viewAgendadosBtn = document.getElementById('view-agendados-btn');
const viewHistoricoBtn = document.getElementById('view-historico-btn');
const agendadosContent = document.getElementById('agendados-content');
const historicoContent = document.getElementById('historico-content');

const notificationsBellContainer = document.getElementById(
  'notifications-bell-container'
);
const notificationBadge = document.getElementById('notification-badge');
const notificationsPanel = document.getElementById('notifications-panel');
const notificationsList = document.getElementById('notifications-list');

const registerContainer = document.getElementById('register-container');
const showRegisterFormBtn = document.getElementById('show-register-form-btn');
const backToLoginBtn = document.getElementById('back-to-login-btn');
const registerForm = document.getElementById('register-form');
const createAccountBtn = document.getElementById('create-account-btn');
const registerError = document.getElementById('register-error');
const profileForm = document.getElementById('profile-form');

// --- Variáveis de Estado Global ---
let allShows = [];
let allSetlists = [];
let allNotifications = [];
let currentUser = null;
let userSettings = {};
let itemToModifyId = null;
let itemTypeToDelete = '';
let unsubscribeShows = [];
let unsubscribeSetlists = [];
let unsubscribeNotifications = null;
let currentCalendarDate = new Date();
let showsPerMonthChart = null;
let topLocationsChart = null;
let topArtistsChart = null;
let allRiders = [];
let unsubscribeRiders = [];
let allTeamMembers = [];
let unsubscribeTeam = [];
let map = null;
let layers = {
  show: L.layerGroup(),
  ensaio: L.layerGroup(),
  entrevista: L.layerGroup(),
  gravacao: L.layerGroup(),
  viagem: L.layerGroup(),
};
let historicoCurrentPage = 1;
const historicoItemsPerPage = 5;

// --- Funções Auxiliares ---
const showError = message => {
  errorBanner.textContent = message;
  errorBanner.classList.remove('hidden');
};
const showLoginError = message => {
  loginError.textContent = message;
  loginError.classList.remove('hidden');
};
const formatDate = dateString => {
  if (!dateString) return 'Data inválida';
  const date = new Date(dateString + 'T00:00:00');
  const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
    }, ${formattedDate}`;
};

// Adicione estas constantes junto com as outras
const resetPasswordModal = document.getElementById('reset-password-modal');
const resetPasswordForm = document.getElementById('reset-password-form');
const newPasswordInput = document.getElementById('new-password');
const resetFeedback = document.getElementById('reset-feedback');

// Função para extrair parâmetros da URL
const getURLParameter = name => {
  return new URLSearchParams(window.location.search).get(name);
};

// Lógica para lidar com a redefinição de senha
const handlePasswordReset = async () => {
  const mode = getURLParameter('mode');
  const actionCode = getURLParameter('oobCode');

  if (mode === 'resetPassword' && actionCode) {
    try {
      // Verifique se o código é válido
      await verifyPasswordResetCode(auth, actionCode);

      // Mostre o modal para o usuário inserir a nova senha
      resetPasswordModal.classList.add('is-open');

      resetPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        const newPassword = newPasswordInput.value;

        try {
          // Salve a nova senha
          await confirmPasswordReset(auth, actionCode, newPassword);
          resetFeedback.textContent =
            'Senha redefinida com sucesso! Você já pode fazer login com a nova senha.';
          resetFeedback.className = 'text-sm mt-4 text-green-400';
          resetFeedback.classList.remove('hidden');

          // Fecha o modal após alguns segundos
          setTimeout(() => {
            resetPasswordModal.classList.remove('is-open');
            // Limpa os parâmetros da URL para evitar que o modal reapareça
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          }, 4000);
        } catch (error) {
          console.error('Erro ao redefinir a senha:', error);
          resetFeedback.textContent =
            'Link inválido ou expirado. Tente novamente.';
          resetFeedback.className = 'text-sm mt-4 text-red-400';
          resetFeedback.classList.remove('hidden');
        }
      });
    } catch (error) {
      console.error('Código de redefinição inválido:', error);
      showLoginError(
        'O link para redefinição de senha é inválido ou expirou. Por favor, solicite um novo.'
      );
    }
  }
};

// Chame a função quando a página carregar
window.addEventListener('DOMContentLoaded', handlePasswordReset);

// --- Funções de Notificação ---
const notifyLinkedMusicians = async (
  musicianIds,
  message,
  showDate,
  showTime
) => {
  if (!currentUser || !userSettings.isManager || musicianIds.length === 0)
    return;
  try {
    musicianIds.forEach(musicianId => {
      const notification = {
        message: message,
        read: false,
        timestamp: serverTimestamp(),
        showDate: showDate || null,
        showTime: showTime || null,
      };
      addDoc(
        collection(db, `artifacts/${appId}/users/${musicianId}/notifications`),
        notification
      );
    });
  } catch (error) {
    console.error('Erro ao tentar notificar músicos:', error);
  }
};
const renderNotifications = () => {
  notificationsList.innerHTML = '';
  const unreadCount = allNotifications.filter(n => !n.read).length;

  if (unreadCount > 0) {
    notificationBadge.textContent = unreadCount;
    notificationBadge.classList.remove('hidden');
  } else {
    notificationBadge.classList.add('hidden');
  }

  if (allNotifications.length === 0) {
    notificationsList.innerHTML =
      '<p class="p-4 text-sm text-gray-400">Nenhuma notificação ainda.</p>';
    return;
  }

  allNotifications.forEach(notif => {
    const notifElement = document.createElement('div');
    const isUnread = !notif.read ? 'bg-purple-500/10' : '';
    notifElement.className = `p-3 border-b border-gray-700 ${isUnread}`;

    const dateInfo = notif.showDate
      ? `<p class="text-xs text-gray-400 mt-1">${formatDate(notif.showDate)}${notif.showTime ? ` às ${notif.showTime}` : ''
      }</p>`
      : '';

    notifElement.innerHTML = `
            <p class="text-sm text-gray-200">${notif.message}</p>
            ${dateInfo}
        `;

    notificationsList.appendChild(notifElement);
  });
};

const markNotificationsAsRead = () => {
  allNotifications.forEach(notif => {
    if (!notif.read) {
      const notifRef = doc(
        db,
        `artifacts/${appId}/users/${currentUser.uid}/notifications`,
        notif.id
      );
      updateDoc(notifRef, { read: true });
    }
  });
};

const renderMap = async () => {
  const loader = document.getElementById('map-loader');
  if (loader) {
    loader.style.display = 'flex';
    lucide.createIcons();
  }

  if (!map) {
    map = L.map('mapa-shows');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    Object.values(layers).forEach(layer => layer.addTo(map));
    setupMapFilters();
  }

  Object.values(layers).forEach(layer => layer.clearLayers());

  // Gera a legenda dinamicamente
  const legendContainer = document.getElementById('map-legend');
  legendContainer.innerHTML = '';
  for (const type in eventTypes) {
    const typeInfo = eventTypes[type];
    const legendItem = `
            <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 rounded-full" style="background-color: ${typeInfo.calendarBg};"></div> 
                ${typeInfo.text}
            </div>
        `;
    legendContainer.insertAdjacentHTML('beforeend', legendItem);
  }

  const eventsWithLocation = allShows.filter(
    show => show.location && show.location.trim() !== ''
  );

  if (eventsWithLocation.length === 0) {
    map.setView([-14.235, -51.925], 4);
    if (loader) loader.style.display = 'none';
    return;
  }

  const markerDataPromises = eventsWithLocation.map(async show => {
    let lat = show.lat;
    let lng = show.lng;
    if (!lat || !lng) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            show.location
          )}&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          lat = parseFloat(data[0].lat);
          lng = parseFloat(data[0].lon);

          const ownerId = show.isPersonal
            ? currentUser.uid
            : userSettings.managedBy;
          if (ownerId) {
            const showRef = doc(
              db,
              `artifacts/${appId}/users/${ownerId}/shows`,
              show.id
            );
            updateDoc(showRef, { lat, lng });
          }
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
    if (lat && lng)
      return {
        lat,
        lng,
        eventType: show.eventType || 'show',
        artists: show.artists,
        location: show.location,
      };
    return null;
  });

  const allMarkerData = (await Promise.all(markerDataPromises)).filter(Boolean);

  allMarkerData.forEach(data => {
    const eventType = data.eventType;
    const typeInfo = eventTypes[eventType] || eventTypes.show;
    const icon = createColorIcon(typeInfo.calendarBg);

    if (layers[eventType]) {
      L.marker([data.lat, data.lng], { icon: icon })
        .bindPopup(
          `<b>${typeInfo.text}: ${data.artists}</b><br>${data.location}`
        )
        .addTo(layers[eventType]);
    }
  });

  const visibleMarkers = Object.values(layers).flatMap(layer =>
    map.hasLayer(layer) ? layer.getLayers() : []
  );
  if (visibleMarkers.length > 0) {
    const featureGroup = L.featureGroup(visibleMarkers);
    map.fitBounds(featureGroup.getBounds().pad(0.1));
  } else {
    map.setView([-14.235, -51.925], 4);
  }

  if (loader) loader.style.display = 'none';
};

const createColorIcon = color => {
  const markerHtml = `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`;
  return new L.DivIcon({
    html: markerHtml,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// --- Funções de Modais e UI ---
const renderColorPickers = colorSettings => {
  const container = document.getElementById('event-colors-container');
  container.innerHTML = '';

  const defaultColors = {
    show: { color: '#c4b5fd', calendarBg: '#8b5cf6' },
    ensaio: { color: '#fcd34d', calendarBg: '#f59e0b' },
    entrevista: { color: '#6ee7b7', calendarBg: '#10b981' },
    gravacao: { color: '#93c5fd', calendarBg: '#3b82f6' },
    viagem: { color: '#a5b4fc', calendarBg: '#6366f1' },
  };

  for (const type in eventTypes) {
    const typeInfo = eventTypes[type];
    const userColors = colorSettings ? colorSettings[type] : null;

    const currentColor = userColors
      ? userColors.color
      : defaultColors[type].color;
    const currentBg = userColors
      ? userColors.calendarBg
      : defaultColors[type].calendarBg;

    const pickerHTML = `
            <div class="flex items-center justify-between p-2 rounded-lg border-b border-gray-700/50">
                <label for="${type}-color-picker" class="font-medium text-gray-300 flex items-center gap-2">
                    <i data-lucide="${typeInfo.icon}" class="w-5 h-5" style="color: ${currentColor};"></i>
                    ${typeInfo.text}
                </label>
                <div class="flex items-center gap-4">
                    <div class="flex flex-col items-center">
                        <span class="text-xs text-gray-500 mb-1">Texto/Ícone</span>
                        <input type="color" id="${type}-color-picker" data-type="${type}" data-prop="color" value="${currentColor}" class="w-10 h-10 p-1 bg-gray-700 rounded-lg cursor-pointer border-2 border-transparent">
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="text-xs text-gray-500 mb-1">Fundo Calendário</span>
                        <input type="color" id="${type}-bg-picker" data-type="${type}" data-prop="calendarBg" value="${currentBg}" class="w-10 h-10 p-1 bg-gray-700 rounded-lg cursor-pointer border-2 border-transparent">
                    </div>
                </div>
            </div>
        `;
    container.insertAdjacentHTML('beforeend', pickerHTML);
  }
  lucide.createIcons();
};

const openEditShowModal = showId => {
  itemToModifyId = showId;
  const show = allShows.find(s => s.id === showId);
  if (show) {
    document.getElementById('edit-type').value = show.eventType || 'show';
    document.getElementById('edit-date').value = show.date;
    document.getElementById('edit-time').value = show.time || '';
    document.getElementById('edit-artists').value = show.artists;
    document.getElementById('edit-location').value = show.location;
    document.getElementById('edit-status').value = show.status;
    document.getElementById('edit-observacoes').value = show.observacoes;
    document.getElementById('edit-setlist').value = show.setlistId || '';
    editModal.classList.add('is-open');
    populateMusiciansChecklist('edit', show.linkedMusicians || []);

    const privateCheckbox = document.getElementById('edit-private-event');
    privateCheckbox.checked = show.isPrivate || false;
    privateCheckbox.dispatchEvent(new Event('change'));

    editModal.classList.add('is-open');
  }
};

const openDeleteConfirmationModal = (showId, name) => {
  itemToModifyId = showId;
  itemTypeToDelete = 'show';
  document.getElementById(
    'delete-confirm-text'
  ).textContent = `Tem certeza de que deseja excluir o show "${name}"?`;
  deleteModal.classList.add('is-open');
};

const downloadSetlistAsPDF = setlistId => {
  const setlist = allSetlists.find(s => s.id === setlistId);
  if (!setlist) {
    showError('Setlist não encontrada para download.');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(22);
  doc.text(setlist.name, 14, 22);
  if (userSettings && userSettings.artistName) {
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(userSettings.artistName, 14, 30);
  }
  const songs = setlist.songs.split('\n');
  doc.setFontSize(12);
  doc.setTextColor(0);
  let y = 45;
  songs.forEach((song, index) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(`${index + 1}. ${song.trim()}`, 14, y);
    y += 10;
  });
  const fileName = `Setlist-${setlist.name.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  doc.save(fileName);
};

// main.js - Substitua TODA a sua função openShowDetailsModal por esta versão corrigida

const openShowDetailsModal = showId => {
  const show = allShows.find(s => s.id === showId);
  if (!show) return;

  const detailsContent = document.getElementById('show-details-content');

  // ... (todo o código para gerar typeHTML, timeHTML, etc., permanece o mesmo) ...
  const eventType = show.eventType || 'show';
  const typeInfo = eventTypes[eventType] || eventTypes.show;
  const statusInfo = statusMap[show.status] || { text: '', color: '' };
  const setlist = allSetlists.find(s => s.id === show.setlistId);

  const typeHTML = `<p class="flex items-center gap-3"><i data-lucide="${typeInfo.icon}" class="w-5 h-5" style="color: ${typeInfo.color};"></i> <span class="font-semibold">${typeInfo.text}</span></p>`;
  const timeHTML = show.time
    ? `<p class="flex items-center gap-3"><i data-lucide="clock" class="w-5 h-5 text-gray-400"></i> <span>${show.time}</span></p>`
    : '';
  const locationHTML = show.location
    ? `<p class="flex items-center gap-3"><i data-lucide="map-pin" class="w-5 h-5 text-gray-400"></i> <span>${show.location}</span></p>`
    : '';
  const statusHTML = `<div class="flex items-center gap-3"><i data-lucide="flag" class="w-5 h-5 text-gray-400"></i> <span class="text-sm font-bold py-1 px-3 rounded-full ${statusInfo.color}">${statusInfo.text}</span></div>`;
  const obsHTML = show.observacoes
    ? `<div class="pt-2"><p class="font-semibold text-gray-300">Observações:</p><p class="text-gray-400 whitespace-pre-wrap">${show.observacoes}</p></div>`
    : '';

  let teamHTML = '';
  if (
    userSettings.isManager &&
    show.linkedMusicians &&
    show.linkedMusicians.length > 0
  ) {
    const linkedMembers = show.linkedMusicians
      .map(id => allTeamMembers.find(member => member.id === id))
      .filter(Boolean);
    if (linkedMembers.length > 0) {
      const memberList = linkedMembers
        .map(
          member =>
            `<li class="text-gray-400 text-sm flex items-center gap-2"><i data-lucide="user-check" class="w-4 h-4 text-gray-500"></i> ${member.name} (${member.instrumento})</li>`
        )
        .join('');
      teamHTML = `<div class="pt-2"><p class="font-semibold text-gray-300 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5"></i> Equipe do Evento</p><ul class="mt-1 space-y-1">${memberList}</ul></div>`;
    }
  }

  let setlistHTML = '';
  if (setlist) {
    setlistHTML = `<div class="pt-2"><p class="font-semibold text-gray-300 flex items-center gap-2"><i data-lucide="list-music" class="w-5 h-5"></i> Setlist: ${setlist.name}</p><button id="download-setlist-pdf-btn" class="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><i data-lucide="download" class="w-5 h-5"></i> Baixar Setlist em PDF</button></div>`;
  } else {
    setlistHTML = `<div class="pt-2"><p class="font-semibold text-gray-300 flex items-center gap-2"><i data-lucide="list-music" class="w-5 h-5"></i> Setlist</p><p class="text-sm text-gray-500 mt-1">Nenhuma setlist associada.</p></div>`;
  }

  // Ação apenas para o dono do show
  const actionButtonsHTML = show.isPersonal
    ? `<div class="flex gap-2 mt-6 border-t border-gray-700 pt-4"><button id="detail-edit-btn" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><i data-lucide="pencil" class="w-5 h-5"></i> Editar</button><button id="detail-delete-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><i data-lucide="trash-2" class="w-5 h-5"></i> Excluir</button></div>`
    : '';

  // **AQUI ESTÁ A MUDANÇA PRINCIPAL**: Inserimos o HTML dos comentários
  detailsContent.innerHTML = `
        <div class="flex justify-between items-start">
            <h2 class="text-2xl font-bold text-purple-300">${show.artists}</h2>
            <button id="close-details-modal" class="text-gray-400 hover:text-white p-2 -mr-2 -mt-2"><i data-lucide="x" class="w-6 h-6"></i></button>
        </div>
        <div class="mt-4 space-y-3">
            ${typeHTML}
            <p class="flex items-center gap-3"><i data-lucide="calendar" class="w-5 h-5 text-gray-400"></i> <span class="font-semibold">${formatDate(
    show.date
  )}</span></p>
            ${timeHTML}
            ${locationHTML}
            ${statusHTML}
            ${obsHTML}
            ${teamHTML}
            ${setlistHTML}
        </div>
        
        <div id="comments-section" class="mt-6 border-t border-gray-700 pt-4">
            <h3 class="text-lg font-semibold text-gray-200 mb-3">Comentários</h3>
            <div id="comments-list" class="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                </div>
            <form id="add-comment-form" class="flex gap-2">
                <input type="text" id="comment-input" placeholder="Adicionar um comentário..." class="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 text-white" required>
                <button type="submit" class="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white">
                    <i data-lucide="send" class="w-5 h-5"></i>
                </button>
            </form>
        </div>
        
        ${actionButtonsHTML}
    `;

  lucide.createIcons();
  showDetailsModal.classList.add('is-open');

  // **AGORA AS FUNÇÕES SÃO CHAMADAS APÓS O HTML EXISTIR**
  loadAndRenderComments(show.ownerId, showId);

  document
    .getElementById('close-details-modal')
    .addEventListener('click', () =>
      showDetailsModal.classList.remove('is-open')
    );

  // Adiciona o "ouvinte" aqui, pois o formulário já foi criado no innerHTML
  const addCommentForm = document.getElementById('add-comment-form');
  addCommentForm.addEventListener('submit', e => {
    e.preventDefault();
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    if (commentText) {
      addComment(show.ownerId, showId, commentText);
      commentInput.value = '';
    }
  });

  const downloadBtn = document.getElementById('download-setlist-pdf-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () =>
      downloadSetlistAsPDF(setlist.id)
    );
  }

  if (show.isPersonal) {
    document.getElementById('detail-edit-btn').addEventListener('click', () => {
      showDetailsModal.classList.remove('is-open');
      openEditShowModal(showId);
    });
    document
      .getElementById('detail-delete-btn')
      .addEventListener('click', () => {
        showDetailsModal.classList.remove('is-open');
        openDeleteConfirmationModal(showId, show.artists);
      });
  }
};

const showModalFieldsHTML = prefix => {
  const typeOptions = Object.entries(eventTypes)
    .map(([key, value]) => `<option value="${key}">${value.text}</option>`)
    .join('');

  return `
    <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="${prefix}-type" class="text-sm font-medium text-gray-400 mb-1">Tipo de Evento</label>
                <select id="${prefix}-type" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">${typeOptions}</select>
            </div>
            <div>
                <label for="${prefix}-status" class="text-sm font-medium text-gray-400 mb-1">Status</label>
                <select id="${prefix}-status" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
                    <option value="confirmado">Confirmado</option>
                    <option value="aguardando">Aguardando</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="realizado">Realizado</option>
                </select>
            </div>
            <div class="md:col-span-2">
                <label for="${prefix}-artists" class="text-sm font-medium text-gray-400 mb-1">Título / Artista(s)</label>
                <input id="${prefix}-artists" type="text" placeholder="Ex: Show com João Silva" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" required>
            </div>
            <div>
                <label for="${prefix}-date" class="text-sm font-medium text-gray-400 mb-1">Data</label>
                <input id="${prefix}-date" type="date" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" required>
            </div>
            <div>
                <label for="${prefix}-time" class="text-sm font-medium text-gray-400 mb-1">Horário</label>
                <input id="${prefix}-time" type="time" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
            </div>
            <div class="md:col-span-2">
                <label for="${prefix}-location" class="text-sm font-medium text-gray-400 mb-1">Local</label>
                <input id="${prefix}-location" type="text" placeholder="Ex: Virada Cultural, SP" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
            </div>
            <div>
                <label for="${prefix}-setlist" class="text-sm font-medium text-gray-400 mb-1">Setlist</label>
                <select id="${prefix}-setlist" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white">
                    <option value="">Nenhuma</option>
                </select>
            </div>
        </div>
        <div>
            <label for="${prefix}-observacoes" class="text-sm font-medium text-gray-400 mb-1">Observações</label>
            <textarea id="${prefix}-observacoes" rows="3" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"></textarea>
        </div>
        
        <div id="${prefix}-manager-options" class="hidden space-y-4 pt-4 border-t border-gray-700">
            <div>
                <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" id="${prefix}-private-event" class="w-5 h-5 bg-gray-900 border-gray-600 text-purple-500 focus:ring-purple-600">
                    <span class="text-gray-300">Marcar como Evento Particular</span>
                </label>
            </div>
            <div id="${prefix}-musicians-container">
                <label class="text-sm font-medium text-gray-400 mb-2 block">Vincular Músicos ao Evento:</label>
                <div id="${prefix}-musicians-list" class="space-y-2 max-h-40 overflow-y-auto bg-gray-900/50 p-3 rounded-lg"></div>
            </div>
        </div>
    </div>
    
    <div class="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-700">
        <button type="button" id="cancel-${prefix}-btn" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button>
        <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg">${prefix === 'add' ? 'Adicionar' : 'Salvar'
    }</button>
    </div>`;
};

const setupModalHTML = () => {
  addModal.innerHTML = `
        <div class="bg-gray-800 rounded-xl shadow-2xl w-11/12 max-w-lg flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-700">
                <h2 class="text-xl font-semibold flex items-center gap-2"><i data-lucide="plus-circle" class="text-green-400"></i>Adicionar Novo Show</h2>
            </div>
            <div class="p-6 space-y-4 overflow-y-auto">
                <form id="add-show-form"></form>
            </div>
        </div>`;

  editModal.innerHTML = `
        <div class="bg-gray-800 rounded-xl shadow-2xl w-11/12 max-w-lg flex flex-col max-h-[90vh]">
            <div class="p-6 border-b border-gray-700">
                <h2 class="text-xl font-semibold flex items-center gap-2"><i data-lucide="pencil" class="text-yellow-400"></i>Editar Show</h2>
            </div>
            <div class="p-6 space-y-4 overflow-y-auto">
                 <form id="edit-show-form"></form>
            </div>
        </div>`;

  deleteModal.innerHTML = `<div class="bg-gray-800 rounded-xl p-6 w-11/12 max-w-sm text-center shadow-2xl"><i data-lucide="alert-triangle" class="mx-auto text-yellow-400 w-12 h-12 mb-4"></i><p id="delete-confirm-text" class="text-lg text-gray-200 mb-6"></p><div class="flex justify-center gap-4"><button id="cancel-delete-btn" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button><button id="confirm-delete-btn" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Confirmar</button></div></div>`;
  confirmStatusModal.innerHTML = `<div class="bg-gray-800 rounded-xl p-6 w-11/12 max-w-sm text-center shadow-2xl"><i data-lucide="help-circle" class="mx-auto text-blue-400 w-12 h-12 mb-4"></i><h2 class="text-xl font-semibold mb-2">Confirmar Show Passado</h2><p id="confirm-status-text" class="text-gray-300 mb-6"></p><div class="flex flex-col gap-3"><button id="confirm-realizado-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Sim, foi Realizado</button><button id="confirm-cancelado-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg">Não, foi Cancelado</button></div></div>`;
  setlistModal.innerHTML = `<div class="bg-gray-800 rounded-xl p-6 w-11/12 max-w-lg text-left shadow-2xl"><h2 id="setlist-modal-title" class="text-xl font-semibold mb-4 flex items-center gap-2"></h2><form id="setlist-form" class="space-y-4"><input type="hidden" id="setlist-id"><div class="md:col-span-2"><label for="setlist-name" class="text-sm font-medium text-gray-400 mb-1">Nome da Setlist</label><input id="setlist-name" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" required></div><div class="md:col-span-2"><label for="setlist-songs" class="text-sm font-medium text-gray-400 mb-1">Músicas (uma por linha)</label><textarea id="setlist-songs" rows="8" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"></textarea></div><div class="md:col-span-2 flex justify-end gap-4 mt-4"><button type="button" id="cancel-setlist-btn" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button><button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Salvar Setlist</button></div></form></div>`;
  showDetailsModal.innerHTML = `<div id="show-details-content" class="bg-gray-800 rounded-xl p-6 w-full max-w-lg text-left shadow-2xl max-h-[90vh] overflow-y-auto"></div>`;

  document.getElementById('add-show-form').innerHTML =
    showModalFieldsHTML('add');
  document.getElementById('edit-show-form').innerHTML =
    showModalFieldsHTML('edit');
  lucide.createIcons();
};

setupModalHTML();

const addShowForm = document.getElementById('add-show-form');
const cancelAddBtn = document.getElementById('cancel-add-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const editShowForm = document.getElementById('edit-show-form');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const confirmRealizadoBtn = document.getElementById('confirm-realizado-btn');
const confirmCanceladoBtn = document.getElementById('confirm-cancelado-btn');
const openAddSetlistModalBtn = document.getElementById(
  'open-add-setlist-modal-btn'
);
const setlistForm = document.getElementById('setlist-form');
const cancelSetlistBtn = document.getElementById('cancel-setlist-btn');
const exportPdfBtn = document.getElementById('export-pdf-btn');
const managerModeToggle = document.getElementById('manager-mode-toggle');
const artistNameInput = document.getElementById('artist-name-input');
const copyInviteCodeBtn = document.getElementById('copy-invite-code-btn');
const linkForm = document.getElementById('link-form');
const unlinkBtn = document.getElementById('unlink-btn');

const renderShows = () => {
  showsListAgendados.innerHTML = '';
  showsListRealizados.innerHTML = '';
  loadingState.classList.add('hidden');
  emptyState.classList.add('hidden');

  const artistFilter = filterArtistInput.value.toLowerCase();
  const locationFilter = filterLocationInput.value.toLowerCase();
  const monthFilter = document.getElementById('filter-month').value;
  const statusFilter = document.getElementById('filter-status').value;

  const filteredShows = allShows.filter(show => {
    const artistMatch = (show.artists || '')
      .toLowerCase()
      .includes(artistFilter);
    const locationMatch = (show.location || '')
      .toLowerCase()
      .includes(locationFilter);
    const dateMatch =
      !monthFilter || (show.date && show.date.startsWith(monthFilter));
    const statusMatch = !statusFilter || show.status === statusFilter;
    return artistMatch && locationMatch && dateMatch && statusMatch;
  });

  // Lógica para Agendados (sem paginação)
  const filteredAgendados = filteredShows
    .filter(s => s.status !== 'realizado' && s.status !== 'cancelado')
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time || '00:00'}`) -
        new Date(`${b.date}T${b.time || '00:00'}`)
    );

  // Lógica para Histórico (com paginação)
  const filteredHistorico = filteredShows
    .filter(s => s.status === 'realizado' || s.status === 'cancelado')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const emptyMessageHTML = (title, subtitle) => `
        <div class="text-center py-10 bg-gray-800/50 rounded-lg">
            <p class="text-gray-400 font-semibold">${title}</p>
            <p class="text-gray-500 text-sm mt-2">${subtitle}</p>
        </div>
    `;

  // Renderiza Agendados
  if (filteredAgendados.length === 0) {
    if (artistFilter || locationFilter || monthFilter || statusFilter) {
      showsListAgendados.innerHTML = emptyMessageHTML(
        'Nenhum show agendado encontrado.',
        'Tente ajustar seus filtros.'
      );
    } else {
      showsListAgendados.innerHTML = emptyMessageHTML(
        'Nenhum show agendado por enquanto.',
        'Clique no botão "+" para adicionar um novo evento.'
      );
    }
  } else {
    filteredAgendados.forEach(show =>
      showsListAgendados.appendChild(createShowElement(show))
    );
  }

  // --- LÓGICA DE PAGINAÇÃO PARA O HISTÓRICO ---
  const paginationControls = document.getElementById(
    'historico-pagination-controls'
  );
  const pageInfo = document.getElementById('historico-page-info');
  const prevBtn = document.getElementById('historico-prev-btn');
  const nextBtn = document.getElementById('historico-next-btn');

  if (filteredHistorico.length > 0) {
    const totalPages = Math.ceil(
      filteredHistorico.length / historicoItemsPerPage
    );

    // Garante que a página atual não seja maior que o total de páginas (após um filtro)
    if (historicoCurrentPage > totalPages) {
      historicoCurrentPage = totalPages;
    }

    const start = (historicoCurrentPage - 1) * historicoItemsPerPage;
    const end = start + historicoItemsPerPage;
    const paginatedItems = filteredHistorico.slice(start, end);

    paginatedItems.forEach(show =>
      showsListRealizados.appendChild(createShowElement(show))
    );

    // Atualiza e exibe os controles de paginação se houver mais de uma página
    if (totalPages > 1) {
      paginationControls.classList.remove('hidden');
      pageInfo.textContent = `Página ${historicoCurrentPage} de ${totalPages}`;
      prevBtn.disabled = historicoCurrentPage === 1;
      nextBtn.disabled = historicoCurrentPage === totalPages;
    } else {
      paginationControls.classList.add('hidden');
    }
  } else {
    paginationControls.classList.add('hidden'); // Esconde os controles se não houver itens
    if (artistFilter || locationFilter || monthFilter || statusFilter) {
      showsListRealizados.innerHTML = emptyMessageHTML(
        'Nenhum evento encontrado no histórico.',
        'Tente ajustar seus filtros.'
      );
    } else {
      showsListRealizados.innerHTML = emptyMessageHTML(
        'O histórico de shows está vazio.',
        'Eventos realizados ou cancelados aparecerão aqui.'
      );
    }
  }
  // --- FIM DA LÓGICA DE PAGINAÇÃO ---

  lucide.createIcons();
};

const setupMapFilters = () => {
  const checkboxes = document.querySelectorAll('.map-filter-cb');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const type = cb.dataset.type;
      if (cb.checked) {
        map.addLayer(layers[type]);
      } else {
        map.removeLayer(layers[type]);
      }
    });
  });
};

const populateMusiciansChecklist = (prefix, selectedMusicians = []) => {
  const listContainer = document.getElementById(`${prefix}-musicians-list`);
  const managerOptions = document.getElementById(`${prefix}-manager-options`);
  const privateEventCheckbox = document.getElementById(
    `${prefix}-private-event`
  );
  const musiciansContainer = document.getElementById(
    `${prefix}-musicians-container`
  );

  listContainer.innerHTML = '';

  if (userSettings.isManager && allTeamMembers.length > 0) {
    managerOptions.classList.remove('hidden');
    allTeamMembers.forEach(musico => {
      const isChecked = selectedMusicians.includes(musico.id);
      const checkboxHTML = `
                <label class="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-700">
                    <input type="checkbox" data-uid="${musico.id
        }" class="musician-checkbox w-5 h-5 bg-gray-900 border-gray-600 text-purple-500 focus:ring-purple-600" ${isChecked ? 'checked' : ''
        }>
                    <div>
                        <span class="text-white">${musico.name}</span>
                        <p class="text-xs text-gray-500">${musico.instrumento
        }</p>
                    </div>
                </label>`;
      listContainer.insertAdjacentHTML('beforeend', checkboxHTML);
    });
  } else {
    managerOptions.classList.add('hidden');
  }

  privateEventCheckbox.addEventListener('change', e => {
    musiciansContainer.classList.toggle('opacity-50', e.target.checked);
    listContainer.querySelectorAll('input').forEach(input => {
      input.disabled = e.target.checked;
      if (e.target.checked) input.checked = false;
    });
  });
};

const createShowElement = show => {
  const showElement = document.createElement('div');
  showElement.className =
    'bg-gray-800 rounded-lg p-4 shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-700/50';
  showElement.dataset.id = show.id;

  const eventType = show.eventType || 'show';
  const typeInfo = eventTypes[eventType] || eventTypes.show;
  const statusInfo = statusMap[show.status] || { text: '', color: '' };
  const statusHTML = show.status
    ? `<div class="text-xs font-bold py-1 px-2 rounded-full ${statusInfo.color}">${statusInfo.text}</div>`
    : '';

  const dayOfMonth = show.date
    ? new Date(show.date + 'T00:00:00').getDate()
    : '';
  const monthShort = show.date
    ? new Date(show.date + 'T00:00:00').toLocaleDateString('pt-BR', {
      month: 'short',
    })
    : '';

  showElement.innerHTML = `
        <div class="flex flex-col items-center justify-center bg-gray-900/50 p-3 rounded-lg w-16 h-16 text-center shrink-0">
            <span class="text-2xl font-bold text-white">${dayOfMonth}</span>
            <span class="text-xs text-gray-400 capitalize">${monthShort}</span>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
                <i data-lucide="${typeInfo.icon
    }" class="w-5 h-5 shrink-0" style="color: ${typeInfo.color
    };"></i>
                <h3 class="font-bold text-lg text-white truncate" title="${show.artists
    }">${show.artists}</h3>
            </div>
            ${show.location
      ? `<p class="text-sm text-gray-400 flex items-center gap-1.5 mt-1 truncate" title="${show.location}"><i data-lucide="map-pin" class="w-4 h-4 shrink-0"></i> ${show.location}</p>`
      : ''
    }
        </div>
        <div class="flex items-center">
            ${statusHTML}
        </div>
    `;
  return showElement;
};

const checkPastShows = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pendingPastShows = allShows.filter(show => {
    const showDate = new Date(show.date + 'T00:00:00');
    return (
      showDate < today &&
      (show.status === 'confirmado' || show.status === 'aguardando') &&
      show.isPersonal
    );
  });

  if (pendingPastShows.length > 0) {
    const showToConfirm = pendingPastShows[0];
    itemToModifyId = showToConfirm.id;
    document.getElementById('confirm-status-text').textContent = `O show de ${showToConfirm.artists
      } em ${showToConfirm.location} (${formatDate(
        showToConfirm.date
      )}) foi realizado?`;
    confirmStatusModal.classList.add('is-open');
  }
};

const handleUser = async user => {
  loadingAuth.classList.add('hidden');

  if (unsubscribeShows) unsubscribeShows.forEach(unsub => unsub());
  if (unsubscribeSetlists) unsubscribeSetlists.forEach(unsub => unsub());
  if (unsubscribeRiders) unsubscribeRiders.forEach(unsub => unsub());
  if (unsubscribeNotifications) unsubscribeNotifications();
  if (unsubscribeTeam) unsubscribeTeam.forEach(unsub => unsub());

  unsubscribeShows = [];
  unsubscribeSetlists = [];
  unsubscribeRiders = [];
  unsubscribeTeam = [];

  if (user) {
    currentUser = user;
    await loadUserSettings(user.uid);

    loginScreen.style.display = 'none';
    appContent.style.display = 'block';

    let personalShows = [],
      managedShows = [],
      personalSetlists = [],
      managedSetlists = [],
      personalRiders = [],
      managedRiders = [];

    const combineAndRenderAll = () => {
      allShows = [
        ...personalShows.map(s => ({
          ...s,
          isPersonal: true,
          ownerId: currentUser.uid,
        })),
        ...managedShows.map(s => ({
          ...s,
          isPersonal: false,
          ownerId: userSettings.managedBy,
        })),
      ];
      allSetlists = [
        ...new Map(
          [...managedSetlists, ...personalSetlists].map(item => [item.id, item])
        ).values(),
      ];
      allRiders = [
          ...personalRiders.map(r => ({ ...r, isPersonal: true })),
          ...managedRiders.map(r => ({ ...r, isPersonal: false }))
      ];
      allRiders.sort((a, b) => a.name.localeCompare(b.name));

      renderShows();
      renderCalendar();
      renderDashboard();
      renderSetlists();
      renderRiders(); 
      renderTeam();
      populateSetlistDropdowns();

      if (!userSettings.managedBy) {
        checkPastShows();
      }
    };

    const personalShowsPath = `artifacts/${appId}/users/${currentUser.uid}/shows`;
    unsubscribeShows.push(
      onSnapshot(query(collection(db, personalShowsPath)), s => {
        personalShows = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        combineAndRenderAll();
      })
    );

    const personalSetlistsPath = `artifacts/${appId}/users/${currentUser.uid}/setlists`;
    unsubscribeSetlists.push(
      onSnapshot(
        query(collection(db, personalSetlistsPath), orderBy('name', 'asc')),
        s => {
          personalSetlists = s.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            isPersonal: true,
          }));
          combineAndRenderAll();
        }
      )
    );
      
    const personalRidersPath = `artifacts/${appId}/users/${currentUser.uid}/riders`;
    unsubscribeRiders.push(
        onSnapshot(query(collection(db, personalRidersPath), orderBy('name', 'asc')), snapshot => {
            personalRiders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            combineAndRenderAll();
        })
    );

    if (userSettings.managedBy) {
      const managedShowsPath = `artifacts/${appId}/users/${userSettings.managedBy}/shows`;
      const qShows = query(
        collection(db, managedShowsPath),
        where('linkedMusicians', 'array-contains', currentUser.uid)
      );
      unsubscribeShows.push(
        onSnapshot(qShows, s => {
          managedShows = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          combineAndRenderAll();
        })
      );

      const managedSetlistsPath = `artifacts/${appId}/users/${userSettings.managedBy}/setlists`;
      unsubscribeSetlists.push(
        onSnapshot(
          query(collection(db, managedSetlistsPath), orderBy('name', 'asc')),
          s => {
            managedSetlists = s.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
              isPersonal: false,
            }));
            combineAndRenderAll();
          }
        )
      );
        
      const managedRidersPath = `artifacts/${appId}/users/${userSettings.managedBy}/riders`;
      unsubscribeRiders.push(
          onSnapshot(query(collection(db, managedRidersPath), orderBy('name', 'asc')), snapshot => {
              managedRiders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              combineAndRenderAll();
          })
      );
    }

    const managerIdForTeam = userSettings.isManager
      ? currentUser.uid
      : userSettings.managedBy;
    if (managerIdForTeam) {
      const followersPath = `artifacts/${appId}/users/${managerIdForTeam}/followers`;
      unsubscribeTeam.push(
        onSnapshot(collection(db, followersPath), async snapshot => {
          const followerIds = snapshot.docs.map(doc => doc.id);
          if (followerIds.length === 0) {
            allTeamMembers = [];
            combineAndRenderAll();
            return;
          }
          const memberPromises = followerIds.map(id =>
            getDoc(doc(db, `artifacts/${appId}/user_settings`, id))
          );
          try {
            const memberDocs = await Promise.all(memberPromises);
            allTeamMembers = memberDocs
              .filter(docSnap => docSnap.exists())
              .map(docSnap => ({
                id: docSnap.id,
                name: docSnap.data().userName,
                instrumento: docSnap.data().instrument,
              }))
              .sort((a, b) => a.name.localeCompare(b.name));
          } catch (error) {
            console.error(
              'Erro ao buscar detalhes dos membros da equipe:',
              error
            );
            allTeamMembers = [];
          } finally {
            combineAndRenderAll();
          }
        })
      );
    } else {
      allTeamMembers = [];
      combineAndRenderAll();
    }

    const notificationsPath = `artifacts/${appId}/users/${currentUser.uid}/notifications`;
    unsubscribeNotifications = onSnapshot(
      query(collection(db, notificationsPath), orderBy('timestamp', 'desc')),
      snapshot => {
        allNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        renderNotifications();
      }
    );
  } else {
    currentUser = null;
    appContent.style.display = 'none';
    loginContainer.classList.remove('hidden');
    loginScreen.style.display = 'flex';
    allShows = [];
    allSetlists = [];
    allRiders = [];
    allNotifications = [];
    renderShows();
    renderRiders();
    renderNotifications();
  }
};

const loadUserSettings = async uid => {
  const settingsRef = doc(db, `artifacts/${appId}/user_settings`, uid);
  try {
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
      userSettings = docSnap.data();
      if (userSettings.eventColors) {
        for (const type in userSettings.eventColors) {
          if (eventTypes[type]) {
            eventTypes[type].color = userSettings.eventColors[type].color;
            eventTypes[type].calendarBg =
              userSettings.eventColors[type].calendarBg;
          }
        }
      }
    } else {
      const defaultSettings = {
        isManager: false,
        managedBy: null,
        userName: 'Músico',
        instrument: 'Não definido',
      };
      await setDoc(settingsRef, defaultSettings);
      userSettings = defaultSettings;
    }
  } catch (error) {
    console.error('Erro ao carregar configurações do usuário:', error);
    userSettings = {};
  } finally {
    updateSettingsUI();
    document.getElementById('profile-name').value = userSettings.userName || '';
    document.getElementById('profile-instrument').value =
      userSettings.instrument || '';
    renderColorPickers(userSettings.eventColors);
  }
};

const updateSettingsUI = async () => {
  const managerToggle = document.getElementById('manager-mode-toggle');
  const managerSettings = document.getElementById('manager-settings');
  const musicianSettings = document.getElementById('musician-settings');
  const linkFormEl = document.getElementById('link-form');
  const managedByInfo = document.getElementById('managed-by-info');

  managerToggle.checked = userSettings.isManager || false;
  managerSettings.classList.toggle('hidden', !userSettings.isManager);
  musicianSettings.classList.toggle('hidden', userSettings.isManager);

  if (userSettings.isManager) {
    document.getElementById('artist-name-input').value =
      userSettings.artistName || '';
    document.getElementById('invite-code').textContent = currentUser.uid;
  }

  if (userSettings.managedBy) {
    linkFormEl.classList.add('hidden');
    managedByInfo.classList.remove('hidden');

    const managerSettingsRef = doc(
      db,
      `artifacts/${appId}/user_settings`,
      userSettings.managedBy
    );
    const managerSnap = await getDoc(managerSettingsRef);
    const managerName = managerSnap.exists()
      ? managerSnap.data().artistName
      : 'Gerente não encontrado';
    document.getElementById('manager-name-display').textContent =
      managerName || `Gerente (${userSettings.managedBy.substring(0, 6)}...)`;
  } else {
    linkFormEl.classList.remove('hidden');
    managedByInfo.classList.add('hidden');
  }

  const instrumentField =
    document.getElementById('profile-instrument').parentElement;
  instrumentField.classList.toggle('hidden', userSettings.isManager);
};

onAuthStateChanged(auth, handleUser);
loginForm.addEventListener('submit', e => e.preventDefault());
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  if (!email || !password) {
    showLoginError('Por favor, preencha e-mail e senha.');
    return;
  }
  signInWithEmailAndPassword(auth, email, password).catch(error => {
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/invalid-credential'
    ) {
      showLoginError('E-mail ou senha inválidos.');
    } else {
      showLoginError('Ocorreu um erro ao fazer login.');
    }
  });
});

const showRegisterError = message => {
  registerError.textContent = message;
  registerError.classList.remove('hidden');
};

profileForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentUser) return;

  const newName = document.getElementById('profile-name').value;
  const newInstrument = document.getElementById('profile-instrument').value;
  const profileSuccess = document.getElementById('profile-success');

  const settingsRef = doc(
    db,
    `artifacts/${appId}/user_settings`,
    currentUser.uid
  );
  try {
    await updateDoc(settingsRef, {
      userName: newName,
      instrument: newInstrument,
    });

    userSettings.userName = newName;

    profileSuccess.classList.remove('hidden');
    setTimeout(() => profileSuccess.classList.add('hidden'), 3000);
  } catch (err) {
    showError('Não foi possível atualizar o perfil.');
    console.error('Erro ao salvar perfil:', err);
  }
});

showRegisterFormBtn.addEventListener('click', () => {
  loginContainer.classList.add('hidden');
  registerContainer.classList.remove('hidden');
  loginError.classList.add('hidden');
});

backToLoginBtn.addEventListener('click', () => {
  registerContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
  registerError.classList.add('hidden');
});

registerForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const instrument = document.getElementById('register-instrument').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!email || !password || !name || !instrument) {
    showRegisterError('Por favor, preencha todos os campos.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const settingsRef = doc(db, `artifacts/${appId}/user_settings`, user.uid);
    await setDoc(settingsRef, {
      userName: name,
      artistName: name,
      instrument: instrument,
      isManager: false,
      managedBy: null,
    });
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showRegisterError('Este e-mail já está em uso.');
    } else if (error.code === 'auth/weak-password') {
      showRegisterError('A senha deve ter pelo menos 6 caracteres.');
    } else {
      showRegisterError('Ocorreu um erro ao registrar.');
      console.error(error);
    }
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

addShowForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentUser) return;
  const date = document.getElementById('add-date').value;
  const time = document.getElementById('add-time').value;
  const artists = document.getElementById('add-artists').value;
  const location = document.getElementById('add-location').value;
  const status = document.getElementById('add-status').value;
  const observacoes = document.getElementById('add-observacoes').value;
  const setlistId = document.getElementById('add-setlist').value;

  const isPrivate = document.getElementById('add-private-event').checked;
  const musicianCheckboxes = document.querySelectorAll(
    '#add-musicians-list input:checked'
  );
  const linkedMusicians = isPrivate
    ? []
    : Array.from(musicianCheckboxes).map(cb => cb.dataset.uid);

  const newShowData = {
    eventType: document.getElementById('add-type').value,
    date,
    time,
    artists,
    location,
    status,
    observacoes,
    setlistId,
    isManaged: userSettings.isManager && !isPrivate,
    isPrivate: isPrivate,
    linkedMusicians: linkedMusicians,
    createdAt: serverTimestamp(),
  };

  try {
    const showsCollectionPath = `artifacts/${appId}/users/${currentUser.uid}/shows`;
    await addDoc(collection(db, showsCollectionPath), newShowData);
    addShowForm.reset();
    addModal.classList.remove('is-open');

    if (!isPrivate) {
      notifyLinkedMusicians(
        linkedMusicians,
        `Novo show: ${artists} em ${location}`,
        date,
        time
      );
    }
  } catch (err) {
    console.error('Erro ao adicionar show:', err);
    showError('Ocorreu um erro ao salvar o show.');
  }
});

filterArtistInput.addEventListener('input', () => {
  historicoCurrentPage = 1; // Reseta a página
  renderShows();
});
filterLocationInput.addEventListener('input', () => {
  historicoCurrentPage = 1; // Reseta a página
  renderShows();
});
document.getElementById('filter-status').addEventListener('input', () => {
  historicoCurrentPage = 1; // Reseta a página
  renderShows();
});

const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
const filtersContainer = document.getElementById('filters-container');
toggleFiltersBtn.addEventListener('click', () => {
  const isHidden = filtersContainer.classList.toggle('hidden');
  document.getElementById('toggle-filters-text').textContent = isHidden
    ? 'Exibir Filtros'
    : 'Ocultar Filtros';
});

document.getElementById('filter-month').addEventListener('input', () => {
  historicoCurrentPage = 1; // Reseta a página
  renderShows();
});
openAddModalBtn.addEventListener('click', () => {
  if (userSettings.isManager && userSettings.artistName) {
    document.getElementById('add-artists').value = userSettings.artistName;
  }
  populateMusiciansChecklist('add');
  addModal.classList.add('is-open');
});
cancelAddBtn.addEventListener('click', () =>
  addModal.classList.remove('is-open')
);

const allListsContainer = document.getElementById('app-content');
allListsContainer.addEventListener('click', e => {
  const showCard = e.target.closest('[data-id]');
  if (
    showCard &&
    (showCard.parentElement.id === 'shows-list-agendados' ||
      showCard.parentElement.id === 'shows-list-realizados')
  ) {
    openShowDetailsModal(showCard.dataset.id);
    return;
  }
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!currentUser || !itemToModifyId) return;

  let collectionName = '';
  if (itemTypeToDelete === 'show') {
    collectionName = 'shows';
  } else if (itemTypeToDelete === 'setlist') {
    collectionName = 'setlists';
  } else if (itemTypeToDelete === 'rider') { // Adicionado
    collectionName = 'riders';
  } else {
    return;
  }

  const showToDelete = allShows.find(
    s => s.id === itemToModifyId && s.isPersonal
  );

  try {
    const docPath = `artifacts/${appId}/users/${currentUser.uid}/${collectionName}/${itemToModifyId}`;
    await deleteDoc(doc(db, docPath));

    if (
      showToDelete &&
      showToDelete.linkedMusicians &&
      showToDelete.linkedMusicians.length > 0
    ) {
      const message = `Show cancelado/removido: ${showToDelete.artists} em ${showToDelete.location}`;
      notifyLinkedMusicians(
        showToDelete.linkedMusicians,
        message,
        showToDelete.date,
        showToDelete.time
      );
    }

    deleteModal.classList.remove('is-open');
    itemToModifyId = null;
    itemTypeToDelete = '';
  } catch (err) {
    console.error('Erro ao excluir item:', err);
    showError(`Não foi possível excluir o item.`);
    deleteModal.classList.remove('is-open');
  }
});
cancelDeleteBtn.addEventListener('click', () => {
  deleteModal.classList.remove('is-open');
  itemToModifyId = null;
});
editShowForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentUser || !itemToModifyId) return;
  const isPrivate = document.getElementById('edit-private-event').checked;
  const musicianCheckboxes = document.querySelectorAll(
    '#edit-musicians-list input:checked'
  );
  const linkedMusicians = isPrivate
    ? []
    : Array.from(musicianCheckboxes).map(cb => cb.dataset.uid);

  const updatedData = {
    eventType: document.getElementById('edit-type').value,
    date: document.getElementById('edit-date').value,
    time: document.getElementById('edit-time').value,
    artists: document.getElementById('edit-artists').value,
    location: document.getElementById('edit-location').value,
    status: document.getElementById('edit-status').value,
    observacoes: document.getElementById('edit-observacoes').value,
    setlistId: document.getElementById('edit-setlist').value,
    isManaged: userSettings.isManager && !isPrivate,
    isPrivate: isPrivate,
    linkedMusicians: linkedMusicians,
  };
  try {
    const ownerId = currentUser.uid;
    const showDocPath = `artifacts/${appId}/users/${ownerId}/shows/${itemToModifyId}`;
    await updateDoc(doc(db, showDocPath), updatedData);
    editModal.classList.remove('is-open');
    itemToModifyId = null;
    if (!isPrivate) {
      notifyLinkedMusicians(
        linkedMusicians,
        `Show atualizado: ${updatedData.artists} em ${updatedData.location}`,
        updatedData.date,
        updatedData.time
      );
    }
  } catch (err) {
    showError('Não foi possível salvar as alterações.');
  }
});

cancelEditBtn.addEventListener('click', () => {
  editModal.classList.remove('is-open');
  itemToModifyId = null;
});

const updatePastShowStatus = async status => {
  if (!currentUser || !itemToModifyId) return;
  try {
    const ownerId = currentUser.uid;
    const showDocPath = `artifacts/${appId}/users/${ownerId}/shows/${itemToModifyId}`;
    await updateDoc(doc(db, showDocPath), { status: status });
    confirmStatusModal.classList.remove('is-open');
    itemToModifyId = null;
    checkPastShows();
  } catch (err) {
    showError('Não foi possível atualizar o status do show.');
  }
};

confirmRealizadoBtn.addEventListener('click', () =>
  updatePastShowStatus('realizado')
);
confirmCanceladoBtn.addEventListener('click', () =>
  updatePastShowStatus('cancelado')
);

const tabs = [
  tabAgenda,
  tabCalendario,
  tabSetlists,
  tabRider,
  tabEquipe,
  tabDashboard,
  tabConfiguracoes,
];
const views = [
  viewAgenda,
  viewCalendario,
  viewSetlists,
  viewRider,
  viewEquipe,
  viewDashboard,
  viewConfiguracoes,
];
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('tab-active'));
    views.forEach(v => v.classList.add('hidden'));
    tab.classList.add('tab-active');
    views[index].classList.remove('hidden');
    lucide.createIcons();
    if (views[index].id === 'view-dashboard') {
      renderDashboard();
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 10);
    }
  });
});

const calendarGrid = document.getElementById('calendar-grid');
const monthYearTitle = document.getElementById('month-year-title');
const calendarShowDetails = document.getElementById('calendar-show-details');

const renderCalendar = () => {
  calendarGrid.innerHTML = '';
  const month = currentCalendarDate.getMonth();
  const year = currentCalendarDate.getFullYear();
  monthYearTitle.textContent = `${currentCalendarDate.toLocaleString('pt-BR', {
    month: 'long',
  })} ${year}`;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarGrid.insertAdjacentHTML('beforeend', '<div></div>');
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    const showsOnDay = allShows.filter(s => s.date === dateStr);
    let dayClass = '';
    let dayStyle = '';
    if (showsOnDay.length > 0) {
      const eventType = showsOnDay[0].eventType || 'show';
      const typeInfo = eventTypes[eventType] || eventTypes.show;
      dayClass = 'has-event';
      dayStyle = `style="background-color: ${typeInfo.calendarBg};"`;
    }
    calendarGrid.insertAdjacentHTML(
      'beforeend',
      `<div data-date="${dateStr}" class="calendar-day p-2 cursor-pointer hover:bg-gray-700 rounded-full ${dayClass}" ${dayStyle}>${day}</div>`
    );
  }
};

document.getElementById('prev-month-btn').addEventListener('click', () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById('next-month-btn').addEventListener('click', () => {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
});

calendarGrid.addEventListener('click', e => {
  if (e.target.classList.contains('calendar-day') && e.target.dataset.date) {
    document
      .querySelectorAll('.calendar-day.selected')
      .forEach(el => el.classList.remove('selected'));
    e.target.classList.add('selected');
    const dateStr = e.target.dataset.date;
    const showsOnDay = allShows.filter(s => s.date === dateStr);
    calendarShowDetails.innerHTML = '';
    if (showsOnDay.length > 0) {
      showsOnDay.forEach(show => {
        const statusInfo = statusMap[show.status] || { text: '', color: '' };
        const statusHTML = show.status
          ? `<div class="text-xs font-bold py-1 px-2 rounded-full ${statusInfo.color}">${statusInfo.text}</div>`
          : '';
        const showCard = document.createElement('div');
        showCard.className = 'bg-gray-800 rounded-lg p-4 cursor-pointer';
        showCard.innerHTML = `<div class="flex justify-between items-start"><p class="font-bold text-purple-300 pointer-events-none">${show.artists}</p>${statusHTML}</div><p class="text-sm text-gray-400 mt-1 pointer-events-none">${show.location}</p>`;
        showCard.addEventListener('click', () => openShowDetailsModal(show.id));
        calendarShowDetails.appendChild(showCard);
      });
    } else {
      calendarShowDetails.innerHTML = `<p class="text-center text-gray-500">Nenhum show neste dia.</p>`;
    }
  }
});

const renderDashboard = () => {
  renderMap();
  renderShowsPerMonth();
  renderTopLocations();
  renderTopArtists();
};
const renderShowsPerMonth = () => {
  const ctx = document.getElementById('shows-per-month-chart').getContext('2d');
  const labels = [];
  const data = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' })
    );
    const monthShows = allShows.filter(s => {
      const showDate = new Date(s.date + 'T00:00:00');
      return (
        showDate.getFullYear() === date.getFullYear() &&
        showDate.getMonth() === date.getMonth()
      );
    });
    data.push(monthShows.length);
  }
  if (showsPerMonthChart) showsPerMonthChart.destroy();
  showsPerMonthChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Nº de Shows', data, backgroundColor: '#8b5cf6' }],
    },
    options: {
      scales: {
        y: { beginAtZero: true, ticks: { color: '#9ca3af', stepSize: 1 } },
        x: { ticks: { color: '#9ca3af' } },
      },
      plugins: { legend: { labels: { color: '#9ca3af' } } },
    },
  });
};

const renderTopLocations = () => {
  const ctx = document.getElementById('top-locations-chart').getContext('2d');
  const locationCounts = {};
  allShows.forEach(show => {
    const location = (show.location || 'N/A').trim();
    if (location) {
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    }
  });

  const sortedLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const labels = sortedLocations.map(a => a[0]);
  const data = sortedLocations.map(a => a[1]);

  // Função para gerar cores vibrantes e distintas
  const generateCoolColors = count => {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      // Usamos saturação e luminosidade diferentes para variar a paleta
      const hue = (i * hueStep + 30) % 360; // Adiciona um offset para começar com cores diferentes
      colors.push(`hsl(${hue}, 75%, 65%)`);
    }
    return colors;
  };

  const backgroundColors = generateCoolColors(labels.length);

  if (topLocationsChart) topLocationsChart.destroy();
  topLocationsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#9ca3af',
          },
        },
      },
    },
  });
};

const renderTopArtists = () => {
  const ctx = document.getElementById('top-artists-chart').getContext('2d');
  const artistCounts = {};

  // Conta a frequência de cada artista
  allShows.forEach(show => {
    const artist = (show.artists || 'N/A').trim();
    if (artist) {
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    }
  });

  const sortedArtists = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);
  const labels = sortedArtists.map(a => a[0]);
  const data = sortedArtists.map(a => a[1]);

  // Função para gerar cores vibrantes e distintas
  const generateCoolColors = count => {
    const colors = [];
    const hueStep = 360 / count;
    for (let i = 0; i < count; i++) {
      const hue = i * hueStep;
      colors.push(`hsl(${hue}, 70%, 60%)`);
    }
    return colors;
  };

  const backgroundColors = generateCoolColors(labels.length);

  if (topArtistsChart) topArtistsChart.destroy();
  topArtistsChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#9ca3af',
          },
        },
      },
    },
  });
};
const setlistsList = document.getElementById('setlists-list');
const emptySetlistState = document.getElementById('empty-setlist-state');

const renderTeam = () => {
  const equipeList = document.getElementById('equipe-list');
  const emptyState = document.getElementById('empty-equipe-state');
  const emptySubtext = document.getElementById('empty-equipe-subtext');

  equipeList.innerHTML = '';

  if (userSettings.isManager) {
    emptySubtext.textContent =
      'Sua equipe é formada pelos músicos que se vinculam a você usando seu código de convite.';
  } else if (userSettings.managedBy) {
    emptySubtext.textContent = 'Esta é a equipe do seu gerente.';
  } else {
    emptySubtext.textContent = 'Vincule-se a um gerente para ver uma equipe.';
  }

  emptyState.classList.toggle('hidden', allTeamMembers.length > 0);

  allTeamMembers.forEach(musico => {
    const musicoElement = document.createElement('div');
    musicoElement.className =
      'bg-gray-800 rounded-lg p-5 shadow-md flex justify-between items-center';

    musicoElement.innerHTML = `
            <div>
                <h3 class="text-xl font-bold text-blue-300">${musico.name}</h3>
                <p class="text-gray-400">${musico.instrumento || 'Instrumento não definido'
      }</p>
            </div>`;
    equipeList.appendChild(musicoElement);
  });
  lucide.createIcons();
};

// --- FUNÇÕES DO RIDER TÉCNICO ---
const emptyRiderState = document.getElementById('empty-rider-state');

const renderRiders = () => {
    ridersList.innerHTML = '';
    emptyRiderState.classList.toggle('hidden', allRiders.length > 0);

    allRiders.forEach(rider => {
        const riderElement = document.createElement('div');
        riderElement.className = 'bg-gray-800 rounded-lg p-5 shadow-md';

        const actionButtons = rider.isPersonal ? `
            <div class="flex gap-2">
                <button data-id="${rider.id}" class="edit-rider-btn bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 p-2 rounded-full"><i data-lucide="pencil" class="w-5 h-5 pointer-events-none"></i></button>
                <button data-id="${rider.id}" class="delete-rider-btn bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-full"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
            </div>
        ` : '';

        riderElement.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-bold text-blue-300">${rider.name}</h3>
                    <p class="text-sm text-gray-400">${rider.channels ? rider.channels.length : 0} canais</p>
                </div>
                <div class="flex items-center gap-4">
                    <button data-id="${rider.id}" class="download-rider-btn bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                        <i data-lucide="file-down" class="w-4 h-4"></i> PDF
                    </button>
                    ${actionButtons}
                </div>
            </div>
        `;
        ridersList.appendChild(riderElement);
    });
    lucide.createIcons();
};

const addChannelRow = (channel = { name: '', instrument: '', mic: '' }) => {
    const channelRow = document.createElement('div');
    channelRow.className = 'grid grid-cols-1 md:grid-cols-4 gap-2 items-center rider-channel-row';
    channelRow.innerHTML = `
        <input type="text" value="${channel.name}" data-prop="name" placeholder="Canal (Ex: 01)" class="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white">
        <input type="text" value="${channel.instrument}" data-prop="instrument" placeholder="Instrumento (Ex: Voz)" class="w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white md:col-span-2">
        <div class="flex items-center gap-2">
            <input type="text" value="${channel.mic}" data-prop="mic" placeholder="Microfone (Ex: SM58)" class="flex-1 w-full bg-gray-900/50 border border-gray-600 rounded-lg p-2 text-white">
            <button type="button" class="remove-channel-btn p-2 text-red-400 hover:text-red-300"><i data-lucide="x-circle" class="w-5 h-5 pointer-events-none"></i></button>
        </div>
    `;
    document.getElementById('rider-channels-container').appendChild(channelRow);
};

const openRiderModal = (id = null) => {
    
    riderForm.reset();
    riderChannelsContainer.innerHTML = '';
    document.getElementById('rider-id').value = id || '';
    
    if (id) {
        riderModalTitle.innerHTML = '<i data-lucide="pencil" class="text-yellow-400"></i> Editar Rider Técnico';
        const riderData = allRiders.find(r => r.id === id);
        if (riderData) {
            document.getElementById('rider-name').value = riderData.name;
            (riderData.channels || []).forEach(channel => addChannelRow(channel));
        }
    } else {
        riderModalTitle.innerHTML = '<i data-lucide="plus-circle" class="text-blue-400"></i> Novo Rider Técnico';
        addChannelRow();
    }
    lucide.createIcons();
    riderModal.classList.add('is-open');
};

const renderSetlists = () => {
  setlistsList.innerHTML = '';
  emptySetlistState.classList.toggle('hidden', allSetlists.length > 0);
  allSetlists.forEach(setlist => {
    const setlistElement = document.createElement('div');
    setlistElement.className = 'bg-gray-800 rounded-lg shadow-md'; // Estilo do container principal
    setlistElement.dataset.type = 'setlist-card';

    const songsHTML = (setlist.songs || '')
      .split('\n')
      .map(song => `<li class="text-gray-400">${song}</li>`)
      .join('');

    const actionButtons =
      !userSettings.managedBy || setlist.isPersonal
        ? `
            <div class="flex gap-2">
                <button data-id="${setlist.id}" class="edit-setlist-btn bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 p-2 rounded-full"><i data-lucide="pencil" class="w-5 h-5 pointer-events-none"></i></button>
                <button data-id="${setlist.id}" class="delete-setlist-btn bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-full"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
            </div>
        `
        : '';

    setlistElement.innerHTML = `
            <div class="setlist-header flex justify-between items-center p-5 cursor-pointer">
                <h3 class="text-xl font-bold text-green-300">${setlist.name}</h3>
                <div class="flex items-center gap-4">
                    ${actionButtons}
                    <i data-lucide="chevron-down" class="w-5 h-5 text-gray-400 transition-transform"></i>
                </div>
            </div>
            <div class="setlist-body hidden p-5 border-t border-gray-700">
                <ul class="list-disc list-inside">${songsHTML}</ul>
            </div>`;
    setlistsList.appendChild(setlistElement);
  });
  lucide.createIcons();
};

setlistsList.addEventListener('click', e => {
  const header = e.target.closest('.setlist-header');
  const editBtn = e.target.closest('.edit-setlist-btn');
  const deleteBtn = e.target.closest('.delete-setlist-btn');

  // Ação para o botão de editar
  if (editBtn) {
    e.stopPropagation(); // Impede que o clique no botão acione a expansão/retração
    openSetlistModal(editBtn.dataset.id);
    return;
  }

  // Ação para o botão de deletar
  if (deleteBtn) {
    e.stopPropagation(); // Impede que o clique no botão acione a expansão/retração
    itemToModifyId = deleteBtn.dataset.id;
    itemTypeToDelete = 'setlist';
    document.getElementById('delete-confirm-text').textContent =
      'Tem certeza que deseja excluir esta setlist?';
    deleteModal.classList.add('is-open');
    return;
  }

  // Ação para expandir/retrair a setlist
  if (header) {
    const body = header.nextElementSibling;
    const icon = header.querySelector('[data-lucide="chevron-down"]');
    body.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
  }
});

const openSetlistModal = (id = null) => {
  setlistForm.reset();
  document.getElementById('setlist-id').value = id || '';
  const title = document.getElementById('setlist-modal-title');
  if (id) {
    title.innerHTML =
      '<i data-lucide="pencil" class="text-yellow-400"></i> Editar Setlist';
    const setlistData = allSetlists.find(s => s.id === id);
    if (setlistData) {
      document.getElementById('setlist-name').value = setlistData.name;
      document.getElementById('setlist-songs').value = setlistData.songs;
    }
  } else {
    title.innerHTML =
      '<i data-lucide="plus-circle" class="text-green-400"></i> Nova Setlist';
  }
  lucide.createIcons();
  setlistModal.classList.add('is-open');
};

openAddSetlistModalBtn.addEventListener('click', () => openSetlistModal());
cancelSetlistBtn.addEventListener('click', () =>
  setlistModal.classList.remove('is-open')
);
setlistForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentUser) return;
  const id = document.getElementById('setlist-id').value;
  const data = {
    name: document.getElementById('setlist-name').value,
    songs: document.getElementById('setlist-songs').value,
  };
  const collectionPath = `artifacts/${appId}/users/${currentUser.uid}/setlists`;
  try {
    if (id) {
      await updateDoc(doc(db, collectionPath, id), data);
    } else {
      await addDoc(collection(db, collectionPath), data);
    }
    setlistModal.classList.remove('is-open');
  } catch (err) {
    showError('Não foi possível salvar a setlist.');
  }
});

const populateSetlistDropdowns = () => {
  const addSelect = document.getElementById('add-setlist');
  const editSelect = document.getElementById('edit-setlist');
  const savedAddValue = addSelect.value;
  const savedEditValue = editSelect.value;
  addSelect.innerHTML = '<option value="">Nenhuma</option>';
  editSelect.innerHTML = '<option value="">Nenhuma</option>';
  allSetlists.forEach(setlist => {
    const option = `<option value="${setlist.id}">${setlist.name}</option>`;
    addSelect.insertAdjacentHTML('beforeend', option);
    editSelect.insertAdjacentHTML('beforeend', option);
  });
  addSelect.value = savedAddValue;
  editSelect.value = savedEditValue;
};

exportPdfBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('Helvetica', 'normal');
  const artistFilter = filterArtistInput.value;
  const locationFilter = filterLocationInput.value;
  const monthFilter = document.getElementById('filter-month').value;
  const agendados = allShows
    .filter(s => s.status !== 'realizado' && s.status !== 'cancelado')
    .filter(show => {
      const artistMatch = (show.artists || '')
        .toLowerCase()
        .includes(artistFilter.toLowerCase());
      const locationMatch = (show.location || '')
        .toLowerCase()
        .includes(locationFilter.toLowerCase());
      const dateMatch =
        !monthFilter || (show.date && show.date.startsWith(monthFilter));
      return artistMatch && locationMatch && dateMatch;
    })
    .sort(
      (a, b) =>
        new Date(`${a.date}T${a.time || '00:00'}`) -
        new Date(`${b.date}T${b.time || '00:00'}`)
    );
  doc.setFontSize(18);
  doc.text('Agenda de Shows', 14, 22);
  let y = 40;
  doc.setFontSize(14);
  doc.text('Eventos Agendados', 14, y);
  y += 10;
  agendados.forEach(show => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    const eventType = show.eventType || 'show';
    const typeInfo = eventTypes[eventType] || eventTypes.show;
    const timeText = show.time ? ` às ${show.time}` : '';
    const titleText = `[${typeInfo.text}] ${formatDate(
      show.date
    )}${timeText} - ${show.artists}`;
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text(titleText, 14, y);
    y += 8;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    if (show.location) {
      doc.text(`Local: ${show.location}`, 16, y);
      y += 6;
    }
    if (show.observacoes) {
      const lines = doc.splitTextToSize(`Obs: ${show.observacoes}`, 180);
      doc.text(lines, 16, y);
      y += lines.length * 5;
    }
    y += 12;
  });
  doc.save('AGENDA-EVENTOS.pdf');
});

managerModeToggle.addEventListener('change', async e => {
  const isManager = e.target.checked;
  const settingsRef = doc(
    db,
    `artifacts/${appId}/user_settings`,
    currentUser.uid
  );
  try {
    await setDoc(settingsRef, { isManager }, { merge: true });
    await handleUser(currentUser);
  } catch (err) {
    showError('Não foi possível alterar o modo.');
  }
});

artistNameInput.addEventListener('blur', async e => {
  const artistName = e.target.value;
  const settingsRef = doc(
    db,
    `artifacts/${appId}/user_settings`,
    currentUser.uid
  );
  try {
    await setDoc(settingsRef, { artistName }, { merge: true });
    userSettings.artistName = artistName;
  } catch (err) {
    showError('Não foi possível salvar o nome do artista.');
  }
});

copyInviteCodeBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentUser.uid).then(() => {
    const icon = copyInviteCodeBtn.querySelector('i');
    icon.dataset.lucide = 'check';
    lucide.createIcons();
    setTimeout(() => {
      icon.dataset.lucide = 'copy';
      lucide.createIcons();
    }, 2000);
  });
});

linkForm.addEventListener('submit', async e => {
  e.preventDefault();
  const managerId = document.getElementById('manager-code-input').value.trim();
  if (!managerId || !currentUser) return;
  const musicianSettingsRef = doc(
    db,
    `artifacts/${appId}/user_settings`,
    currentUser.uid
  );
  const followerRef = doc(
    db,
    `artifacts/${appId}/users/${managerId}/followers`,
    currentUser.uid
  );
  try {
    await setDoc(
      musicianSettingsRef,
      { managedBy: managerId },
      { merge: true }
    );
    await setDoc(followerRef, { joinedAt: serverTimestamp() });
    await handleUser(currentUser);
  } catch (err) {
    console.error('Erro ao vincular conta:', err);
    showError('Não foi possível vincular a conta. Verifique o código.');
  }
});

unlinkBtn.addEventListener('click', async () => {
  if (!currentUser || !userSettings.managedBy) return;
  if (unsubscribeShows) unsubscribeShows.forEach(unsub => unsub());
  if (unsubscribeSetlists) unsubscribeSetlists.forEach(unsub => unsub());
  unsubscribeShows = [];
  unsubscribeSetlists = [];
  const musicianSettingsRef = doc(
    db,
    `artifacts/${appId}/user_settings`,
    currentUser.uid
  );
  const followerRef = doc(
    db,
    `artifacts/${appId}/users/${userSettings.managedBy}/followers`,
    currentUser.uid
  );
  try {
    await updateDoc(musicianSettingsRef, { managedBy: deleteField() });
    await deleteDoc(followerRef);
    await handleUser(currentUser);
  } catch (err) {
    console.error('Erro ao desvincular:', err);
    showError('Não foi possível desvincular a conta.');
  }
});

const setupAgendaViewToggle = () => {
  viewAgendadosBtn.addEventListener('click', () => {
    agendadosContent.classList.remove('hidden');
    historicoContent.classList.add('hidden');
    viewAgendadosBtn.classList.add('border-purple-400', 'text-white');
    viewAgendadosBtn.classList.remove('border-transparent', 'text-gray-400');
    viewHistoricoBtn.classList.add('border-transparent', 'text-gray-400');
    viewHistoricoBtn.classList.remove('border-purple-400', 'text-white');
  });

  viewHistoricoBtn.addEventListener('click', () => {
    historicoContent.classList.remove('hidden');
    agendadosContent.classList.add('hidden');
    viewHistoricoBtn.classList.add('border-purple-400', 'text-white');
    viewHistoricoBtn.classList.remove('border-transparent', 'text-gray-400');
    viewAgendadosBtn.classList.add('border-transparent', 'text-gray-400');
    viewAgendadosBtn.classList.remove('border-purple-400', 'text-white');
  });
};
setupAgendaViewToggle();

notificationsBellContainer.addEventListener('click', e => {
  e.stopPropagation();
  notificationsPanel.classList.toggle('hidden');
  if (!notificationsPanel.classList.contains('hidden')) {
    markNotificationsAsRead();
  }
});

window.addEventListener('click', () => {
  if (!notificationsPanel.classList.contains('hidden')) {
    notificationsPanel.classList.add('hidden');
  }
});

document
  .getElementById('save-colors-btn')
  .addEventListener('click', async () => {
    if (!currentUser) return;

    const newColors = {};
    const pickers = document.querySelectorAll(
      '#event-colors-container input[type="color"]'
    );

    pickers.forEach(picker => {
      const type = picker.dataset.type;
      const prop = picker.dataset.prop;
      if (!newColors[type]) {
        newColors[type] = {};
      }
      newColors[type][prop] = picker.value;
    });

    const settingsRef = doc(
      db,
      `artifacts/${appId}/user_settings`,
      currentUser.uid
    );
    try {
      await updateDoc(settingsRef, {
        eventColors: newColors,
      });

      await loadUserSettings(currentUser.uid);
      renderCalendar();
      renderShows();

      const successBanner = document.getElementById('colors-success');
      successBanner.classList.remove('hidden');
      setTimeout(() => successBanner.classList.add('hidden'), 3000);
    } catch (err) {
      showError('Não foi possível salvar as cores.');
      console.error('Erro ao salvar cores:', err);
    }
  });

let unsubscribeComments = null; // Variável para controlar a inscrição em tempo real

const loadAndRenderComments = (ownerId, showId) => {
  const commentsList = document.getElementById('comments-list');
  const commentsPath = `artifacts/${appId}/users/${ownerId}/shows/${showId}/comments`;
  const q = query(collection(db, commentsPath), orderBy('timestamp', 'asc'));

  // Cancela a inscrição anterior para não carregar comentários de shows diferentes
  if (unsubscribeComments) {
    unsubscribeComments();
  }

  unsubscribeComments = onSnapshot(q, snapshot => {
    commentsList.innerHTML = ''; // Limpa a lista antes de renderizar
    if (snapshot.empty) {
      commentsList.innerHTML =
        '<p class="text-sm text-gray-500">Nenhum comentário ainda.</p>';
      return;
    }
    snapshot.forEach(doc => {
      const comment = doc.data();
      const commentElement = document.createElement('div');
      commentElement.className = 'text-sm';
      commentElement.innerHTML = `
                <p class="font-semibold text-purple-200">${comment.userName || 'Usuário'
        }</p>
                <p class="text-gray-300">${comment.text}</p>
            `;
      commentsList.appendChild(commentElement);
    });
  });
};

const addComment = async (ownerId, showId, text) => {
  if (!currentUser) return;

  const newComment = {
    text: text,
    userId: currentUser.uid,
    userName: userSettings.userName, // Usando o nome do usuário logado
    timestamp: serverTimestamp(),
  };

  const commentsPath = `artifacts/${appId}/users/${ownerId}/shows/${showId}/comments`;
  try {
    await addDoc(collection(db, commentsPath), newComment);
  } catch (error) {
    console.error('Erro ao adicionar comentário: ', error);
    showError('Não foi possível enviar seu comentário.');
  }
};

// ADICIONE ESTE BLOCO NO FINAL DO ARQUIVO
const historicoPrevBtn = document.getElementById('historico-prev-btn');
const historicoNextBtn = document.getElementById('historico-next-btn');

historicoNextBtn.addEventListener('click', () => {
  historicoCurrentPage++;
  renderShows();
});

historicoPrevBtn.addEventListener('click', () => {
  if (historicoCurrentPage > 1) {
    historicoCurrentPage--;
    renderShows();
  }
});

// --- EVENT LISTENERS PARA RIDER TÉCNICO ---
openAddRiderModalBtn.addEventListener('click', () => openRiderModal());

cancelRiderBtn.addEventListener('click', () => riderModal.classList.remove('is-open'));
addChannelBtn.addEventListener('click', () => addChannelRow());

riderChannelsContainer.addEventListener('click', e => {
    const removeBtn = e.target.closest('.remove-channel-btn');
    if (removeBtn) {
        removeBtn.closest('.rider-channel-row').remove();
    }
});

riderForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!currentUser) return;

    const id = document.getElementById('rider-id').value;
    const channels = [];
    document.querySelectorAll('.rider-channel-row').forEach(row => {
        const inputs = row.querySelectorAll('input');
        channels.push({
            name: inputs[0].value,
            instrument: inputs[1].value,
            mic: inputs[2].value
        });
    });

    const data = {
        name: document.getElementById('rider-name').value,
        channels: channels
    };

    const collectionPath = `artifacts/${appId}/users/${currentUser.uid}/riders`;
    try {
        if (id) {
            await updateDoc(doc(db, collectionPath, id), data);
        } else {
            await addDoc(collection(db, collectionPath), data);
        }
        riderModal.classList.remove('is-open');
    } catch (err) {
        showError('Não foi possível salvar o Rider Técnico.');
        console.error("Erro ao salvar rider: ", err);
    }
});

ridersList.addEventListener('click', e => {
    const editBtn = e.target.closest('.edit-rider-btn');
    const deleteBtn = e.target.closest('.delete-rider-btn');
    const downloadBtn = e.target.closest('.download-rider-btn');

    if (editBtn) {
        openRiderModal(editBtn.dataset.id);
    }
    if (deleteBtn) {
        const riderId = deleteBtn.dataset.id;
        const rider = allRiders.find(r => r.id === riderId);
        itemToModifyId = riderId;
        itemTypeToDelete = 'rider';
        document.getElementById('delete-confirm-text').textContent = `Tem certeza que deseja excluir o rider "${rider.name}"?`;
        deleteModal.classList.add('is-open');
    }
    if (downloadBtn) {
        alert("A função de download em PDF será implementada em breve.");
    }
});