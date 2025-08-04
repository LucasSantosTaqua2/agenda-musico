import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, orderBy, setDoc, getDoc, where, getDocs, deleteField } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// O restante do seu código JavaScript, exatamente como estava, começa aqui
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const appId = firebaseConfig.appId;

const { initializeApp } = window.firebaseApp;
        const { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = window.firebaseAuth;
        const { getFirestore, collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, orderBy, setDoc, getDoc, where, getDocs, deleteField } = window.firebaseFirestore;

        document.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
            
            
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);
            const appId = firebaseConfig.appId;

        const statusMap = {
            confirmado: { text: 'Confirmado', color: 'bg-green-500/20 text-green-300' },
            aguardando: { text: 'Aguardando', color: 'bg-yellow-500/20 text-yellow-300' },
            cancelado: { text: 'Cancelado', color: 'bg-red-500/20 text-red-300' },
            realizado: { text: 'Realizado', color: 'bg-blue-500/20 text-blue-300' }
        };

const eventTypes = {
            show: { text: 'Show', icon: 'music', color: 'text-purple-300', calendarBg: 'bg-purple-500' },
            ensaio: { text: 'Ensaio', icon: 'users', color: 'text-amber-300', calendarBg: 'bg-amber-500' },
            entrevista: { text: 'Entrevista', icon: 'mic', color: 'text-emerald-300', calendarBg: 'bg-emerald-500' },
            gravacao: { text: 'Gravação', icon: 'disc', color: 'text-blue-300', calendarBg: 'bg-blue-500' },
            viagem: { text: 'Viagem', icon: 'plane', color: 'text-indigo-300', calendarBg: 'bg-indigo-500' }
        };

            // --- Constantes para Elementos do DOM ---
            const loginScreen = document.getElementById('login-screen');
            const loginContainer = document.getElementById('login-container');
            const loadingAuth = document.getElementById('loading-auth');
            const appContent = document.getElementById('app-content');
            const loginForm = document.getElementById('login-form');
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const loginError = document.getElementById('login-error');
            const errorBanner = document.getElementById('error-banner');
            
            const showsListAgendados = document.getElementById('shows-list-agendados');
            const showsListRealizados = document.getElementById('shows-list-realizados');
            const loadingState = document.getElementById('loading-state');
            const emptyState = document.getElementById('empty-state');
            const filterArtistInput = document.getElementById('filter-artist');
            const filterLocationInput = document.getElementById('filter-location');
            
            const addModal = document.getElementById('add-modal');
            const openAddModalBtn = document.getElementById('open-add-modal-btn');
            const deleteModal = document.getElementById('confirmation-modal');
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
            
            const notificationsBellContainer = document.getElementById('notifications-bell-container');
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
            let topSetlistsChart = null;
            let allTeamMembers = [];
            let unsubscribeTeam = [];
            let map = null;
            let layers = {
                confirmado: L.layerGroup(),
                aguardando: L.layerGroup(),
                realizado: L.layerGroup(),
                cancelado: L.layerGroup()
            };

            // --- Funções Auxiliares ---
            const showError = (message) => { errorBanner.textContent = message; errorBanner.classList.remove('hidden'); };
            const showLoginError = (message) => { loginError.textContent = message; loginError.classList.remove('hidden'); };
            const formatDate = (dateString) => {
                if (!dateString) return 'Data inválida';
                const date = new Date(dateString + 'T00:00:00');
                const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
                const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                return `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${formattedDate}`;
            };
            // --- Funções de Notificação ---
            const notifyLinkedMusicians = async (musicianIds, message, showDate, showTime) => {
                if (!currentUser || !userSettings.isManager || musicianIds.length === 0) return;
                try {
                    musicianIds.forEach((musicianId) => {
                        const notification = {
                            message: message,
                            read: false,
                            timestamp: serverTimestamp(),
                            showDate: showDate || null,
                            showTime: showTime || null
                        };
                        addDoc(collection(db, `artifacts/${appId}/users/${musicianId}/notifications`), notification);
                    });
                } catch (error) {
                    console.error("Erro ao tentar notificar músicos:", error);
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
                    notificationsList.innerHTML = '<p class="p-4 text-sm text-gray-400">Nenhuma notificação ainda.</p>';
                    return;
                }

                allNotifications.forEach(notif => {
                    const notifElement = document.createElement('div');
                    const isUnread = !notif.read ? 'bg-purple-500/10' : '';
                    notifElement.className = `p-3 border-b border-gray-700 ${isUnread}`;
                    
                    // Lógica para exibir a data e hora do show, se existirem
                    const dateInfo = notif.showDate 
                        ? `<p class="text-xs text-gray-400 mt-1">${formatDate(notif.showDate)}${notif.showTime ? ` às ${notif.showTime}` : ''}</p>` 
                        : '';

                    notifElement.innerHTML = `
                        <p class="text-sm text-gray-200">${notif.message}</p>
                        ${dateInfo}
                    `;
                    
                    notificationsList.appendChild(notifElement);
                });
            };

            const renderColorPickers = (colorSettings) => {
                const container = document.getElementById('event-colors-container');
                container.innerHTML = ''; 

                // Cores padrão para referência, caso o usuário não tenha personalizado
                const defaultColors = {
                    show: { color: '#c4b5fd', calendarBg: '#8b5cf6' },
                    ensaio: { color: '#fcd34d', calendarBg: '#f59e0b' },
                    entrevista: { color: '#6ee7b7', calendarBg: '#10b981' },
                    gravacao: { color: '#93c5fd', calendarBg: '#3b82f6' },
                    viagem: { color: '#a5b4fc', calendarBg: '#6366f1' }
                };

                for (const type in eventTypes) {
                    const typeInfo = eventTypes[type];
                    const userColors = colorSettings ? colorSettings[type] : null;
                    
                    const currentColor = userColors ? userColors.color : defaultColors[type].color;
                    const currentBg = userColors ? userColors.calendarBg : defaultColors[type].calendarBg;

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

            const markNotificationsAsRead = () => {
                allNotifications.forEach(notif => {
                    if (!notif.read) {
                        const notifRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/notifications`, notif.id);
                        updateDoc(notifRef, { read: true });
                    }
                });
            };

// --- FUNÇÃO RENDERMAP ATUALIZADA COM ZOOM AUTOMÁTICO ---
          // --- FUNÇÃO RENDERMAP COM ZOOM INICIAL INTELIGENTE ---
            // --- FUNÇÃO RENDERMAP COM ZOOM DEFINITIVO ---
           // --- FUNÇÃO RENDERMAP FINAL COM LOADING E ZOOM CORRETO ---
            const renderMap = async () => {
                const loader = document.getElementById('map-loader');
                
                // Mostra o loader no início
                if (loader) {
                    loader.style.display = 'flex';
                    lucide.createIcons(); // Garante que o ícone do loader seja renderizado
                }

                if (!map) {
                    map = L.map('mapa-shows'); 
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                    Object.values(layers).forEach(layer => layer.addTo(map));
                    setupMapFilters();
                }

                Object.values(layers).forEach(layer => layer.clearLayers());
                
                const legendContainer = document.getElementById('map-legend');
                legendContainer.innerHTML = `
                    <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-green-500"></div> Confirmado</div>
                    <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-yellow-400"></div> Aguardando</div>
                    <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-blue-500"></div> Realizado</div>
                `;

                const showsWithLocation = allShows.filter(show => show.location && show.location.trim() !== '');
                
                if (showsWithLocation.length === 0) {
                    map.setView([-14.235, -51.925], 4);
                    if (loader) loader.style.display = 'none'; // Esconde o loader
                    return;
                }

                // Espera TODAS as buscas de coordenadas terminarem
                const markerDataPromises = showsWithLocation.map(async (show) => {
                    let lat = show.lat;
                    let lng = show.lng;
                    if (!lat || !lng) {
                        try {
                            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(show.location)}&limit=1`);
                            const data = await response.json();
                            if (data && data.length > 0) {
                                lat = parseFloat(data[0].lat);
                                lng = parseFloat(data[0].lon);
                                
                                const ownerId = show.isPersonal ? currentUser.uid : userSettings.managedBy;
                                if (ownerId) {
                                    const showRef = doc(db, `artifacts/${appId}/users/${ownerId}/shows`, show.id);
                                    updateDoc(showRef, { lat, lng });
                                }
                            }
                        } catch (error) { console.error("Geocoding error:", error); }
                    }
                    if (lat && lng) return { lat, lng, status: show.status || 'aguardando', artists: show.artists, location: show.location };
                    return null;
                });

                const allMarkerData = (await Promise.all(markerDataPromises)).filter(Boolean);

                // Adiciona todos os marcadores de uma vez
                allMarkerData.forEach(data => {
                    const icon = icons[data.status] || icons.aguardando;
                    if (layers[data.status]) {
                         L.marker([data.lat, data.lng], { icon: icon })
                          .bindPopup(`<b>${data.artists}</b><br>${data.location}`)
                          .addTo(layers[data.status]);
                    }
                });
                
                // Define o zoom com base nos marcadores visíveis
                const visibleMarkers = Object.values(layers).flatMap(layer => map.hasLayer(layer) ? layer.getLayers() : []);
                if (visibleMarkers.length > 0) {
                    const featureGroup = L.featureGroup(visibleMarkers);
                    map.fitBounds(featureGroup.getBounds().pad(0.1)); 
                } else {
                    map.setView([-14.235, -51.925], 4); 
                }

                // Esconde o loader APÓS o mapa estar pronto e com zoom
                if (loader) loader.style.display = 'none';
            };
            
            const createColorIcon = (color) => {
                return new L.Icon({
                    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
            };
            const icons = {
                confirmado: createColorIcon('green'),
                aguardando: createColorIcon('yellow'),
                realizado: createColorIcon('blue'),
                cancelado: createColorIcon('red')
            };


            // --- Funções de Modais e UI ---
            const openEditShowModal = (showId) => {
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
                    privateCheckbox.dispatchEvent(new Event('change')); // Dispara o evento para atualizar a UI

                    editModal.classList.add('is-open');
                }
            };

            const openDeleteConfirmationModal = (showId, name) => {
                itemToModifyId = showId;
                itemTypeToDelete = 'show';
                document.getElementById('delete-confirm-text').textContent = `Tem certeza de que deseja excluir o show "${name}"?`;
                deleteModal.classList.add('is-open');
            };

            const downloadSetlistAsPDF = (setlistId) => {
                const setlist = allSetlists.find(s => s.id === setlistId);
                if (!setlist) {
                    showError("Setlist não encontrada para download.");
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
            
const openShowDetailsModal = (showId) => {
                const show = allShows.find(s => s.id === showId);
                if (!show) return;

                const detailsContent = document.getElementById('show-details-content');

                // --- Define todas as variáveis de HTML primeiro ---
                const eventType = show.eventType || 'show';
                const typeInfo = eventTypes[eventType] || eventTypes.show;
                const statusInfo = statusMap[show.status] || { text: '', color: ''};
                const setlist = allSetlists.find(s => s.id === show.setlistId);
                
                const typeHTML = `<p class="flex items-center gap-3"><i data-lucide="${typeInfo.icon}" class="w-5 h-5 ${typeInfo.color}"></i> <span class="font-semibold">${typeInfo.text}</span></p>`;
                const timeHTML = show.time ? `<p class="flex items-center gap-3"><i data-lucide="clock" class="w-5 h-5 text-gray-400"></i> <span>${show.time}</span></p>` : '';
                const locationHTML = show.location ? `<p class="flex items-center gap-3"><i data-lucide="map-pin" class="w-5 h-5 text-gray-400"></i> <span>${show.location}</span></p>` : '';
                const statusHTML = `<div class="flex items-center gap-3"><i data-lucide="flag" class="w-5 h-5 text-gray-400"></i> <span class="text-sm font-bold py-1 px-3 rounded-full ${statusInfo.color}">${statusInfo.text}</span></div>`;
                const obsHTML = show.observacoes ? `<div class="pt-2"><p class="font-semibold text-gray-300">Observações:</p><p class="text-gray-400 whitespace-pre-wrap">${show.observacoes}</p></div>` : '';
                
                let teamHTML = '';
                if (userSettings.isManager && show.linkedMusicians && show.linkedMusicians.length > 0) {
                    const linkedMembers = show.linkedMusicians.map(id => allTeamMembers.find(member => member.id === id)).filter(Boolean);
                    if (linkedMembers.length > 0) {
                        const memberList = linkedMembers.map(member => `<li class="text-gray-400 text-sm flex items-center gap-2"><i data-lucide="user-check" class="w-4 h-4 text-gray-500"></i> ${member.name} (${member.instrumento})</li>`).join('');
                        teamHTML = `<div class="pt-2"><p class="font-semibold text-gray-300 flex items-center gap-2"><i data-lucide="users" class="w-5 h-5"></i> Equipe do Evento</p><ul class="mt-1 space-y-1">${memberList}</ul></div>`;
                    }
                }

                let setlistHTML = '';
                if (setlist) {
                    setlistHTML = `<div class="pt-2"><p class="font-semibold text-gray-300 flex items-center gap-2"><i data-lucide="list-music" class="w-5 h-5"></i> Setlist: ${setlist.name}</p><button id="download-setlist-pdf-btn" class="mt-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><i data-lucide="download" class="w-5 h-5"></i> Baixar Setlist em PDF</button></div>`;
                } else {
                    setlistHTML = `<div class="pt-2"><p class="font-semibold text-gray-300 flex items-center gap-2"><i data-lucide="list-music" class="w-5 h-5"></i> Setlist</p><p class="text-sm text-gray-500 mt-1">Nenhuma setlist associada.</p></div>`;
                }

                const actionButtonsHTML = show.isPersonal ? `<div class="flex gap-2 mt-6 border-t border-gray-700 pt-4"><button id="detail-edit-btn" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><i data-lucide="pencil" class="w-5 h-5"></i> Editar</button><button id="detail-delete-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"><i data-lucide="trash-2" class="w-5 h-5"></i> Excluir</button></div>` : '';

                // --- Agora, monta o HTML final ---
                detailsContent.innerHTML = `
                    <div class="flex justify-between items-start">
                        <h2 class="text-2xl font-bold text-purple-300">${show.artists}</h2>
                        <button id="close-details-modal" class="text-gray-400 hover:text-white p-2 -mr-2 -mt-2"><i data-lucide="x" class="w-6 h-6"></i></button>
                    </div>
                    <div class="mt-4 space-y-3">
                        ${typeHTML}
                        <p class="flex items-center gap-3"><i data-lucide="calendar" class="w-5 h-5 text-gray-400"></i> <span class="font-semibold">${formatDate(show.date)}</span></p>
                        ${timeHTML}
                        ${locationHTML}
                        ${statusHTML}
                        ${obsHTML}
                        ${teamHTML}
                        ${setlistHTML}
                    </div>
                    ${actionButtonsHTML}
                `;

                lucide.createIcons();
                showDetailsModal.classList.add('is-open');

                document.getElementById('close-details-modal').addEventListener('click', () => showDetailsModal.classList.remove('is-open'));

                const downloadBtn = document.getElementById('download-setlist-pdf-btn');
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', () => downloadSetlistAsPDF(setlist.id));
                }

                if (show.isPersonal) {
                    document.getElementById('detail-edit-btn').addEventListener('click', () => {
                        showDetailsModal.classList.remove('is-open');
                        openEditShowModal(showId);
                    });
                    document.getElementById('detail-delete-btn').addEventListener('click', () => {
                        showDetailsModal.classList.remove('is-open');
                        openDeleteConfirmationModal(showId, show.artists);
                    });
                }
            };

const showModalFieldsHTML = (prefix) => {
                // Gera as opções do dropdown a partir do objeto eventTypes
                const typeOptions = Object.entries(eventTypes).map(([key, value]) => 
                    `<option value="${key}">${value.text}</option>`
                ).join('');

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
                    <button type="submit" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg">${prefix === 'add' ? 'Adicionar' : 'Salvar'}</button>
                </div>`;
            };
            
const setupModalHTML = () => {
                // Nova estrutura do Modal de Adicionar
                addModal.innerHTML = `
                    <div class="bg-gray-800 rounded-xl shadow-2xl w-11/12 max-w-lg flex flex-col max-h-[90vh]">
                        <div class="p-6 border-b border-gray-700">
                            <h2 class="text-xl font-semibold flex items-center gap-2"><i data-lucide="plus-circle" class="text-green-400"></i>Adicionar Novo Show</h2>
                        </div>
                        <div class="p-6 space-y-4 overflow-y-auto">
                            <form id="add-show-form"></form>
                        </div>
                    </div>`;

                // Nova estrutura do Modal de Editar
                editModal.innerHTML = `
                    <div class="bg-gray-800 rounded-xl shadow-2xl w-11/12 max-w-lg flex flex-col max-h-[90vh]">
                        <div class="p-6 border-b border-gray-700">
                            <h2 class="text-xl font-semibold flex items-center gap-2"><i data-lucide="pencil" class="text-yellow-400"></i>Editar Show</h2>
                        </div>
                        <div class="p-6 space-y-4 overflow-y-auto">
                             <form id="edit-show-form"></form>
                        </div>
                    </div>`;
                
                // O restante da função continua igual
                deleteModal.innerHTML = `<div class="bg-gray-800 rounded-xl p-6 w-11/12 max-w-sm text-center shadow-2xl"><i data-lucide="alert-triangle" class="mx-auto text-yellow-400 w-12 h-12 mb-4"></i><p id="delete-confirm-text" class="text-lg text-gray-200 mb-6"></p><div class="flex justify-center gap-4"><button id="cancel-delete-btn" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button><button id="confirm-delete-btn" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg">Confirmar</button></div></div>`;
                confirmStatusModal.innerHTML = `<div class="bg-gray-800 rounded-xl p-6 w-11/12 max-w-sm text-center shadow-2xl"><i data-lucide="help-circle" class="mx-auto text-blue-400 w-12 h-12 mb-4"></i><h2 class="text-xl font-semibold mb-2">Confirmar Show Passado</h2><p id="confirm-status-text" class="text-gray-300 mb-6"></p><div class="flex flex-col gap-3"><button id="confirm-realizado-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">Sim, foi Realizado</button><button id="confirm-cancelado-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg">Não, foi Cancelado</button></div></div>`;
                setlistModal.innerHTML = `<div class="bg-gray-800 rounded-xl p-6 w-11/12 max-w-lg text-left shadow-2xl"><h2 id="setlist-modal-title" class="text-xl font-semibold mb-4 flex items-center gap-2"></h2><form id="setlist-form" class="space-y-4"><input type="hidden" id="setlist-id"><div class="md:col-span-2"><label for="setlist-name" class="text-sm font-medium text-gray-400 mb-1">Nome da Setlist</label><input id="setlist-name" type="text" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white" required></div><div class="md:col-span-2"><label for="setlist-songs" class="text-sm font-medium text-gray-400 mb-1">Músicas (uma por linha)</label><textarea id="setlist-songs" rows="8" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"></textarea></div><div class="md:col-span-2 flex justify-end gap-4 mt-4"><button type="button" id="cancel-setlist-btn" class="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">Cancelar</button><button type="submit" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">Salvar Setlist</button></div></form></div>`;
                showDetailsModal.innerHTML = `<div id="show-details-content" class="bg-gray-800 rounded-xl p-6 w-full max-w-lg text-left shadow-2xl max-h-[90vh] overflow-y-auto"></div>`;
                
                document.getElementById('add-show-form').innerHTML = showModalFieldsHTML('add');
                document.getElementById('edit-show-form').innerHTML = showModalFieldsHTML('edit');
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
            const openAddSetlistModalBtn = document.getElementById('open-add-setlist-modal-btn');
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
    emptyState.classList.add('hidden'); // Oculta a mensagem genérica inicial

    const artistFilter = filterArtistInput.value.toLowerCase();
    const locationFilter = filterLocationInput.value.toLowerCase();
    const monthFilter = document.getElementById('filter-month').value;
    const statusFilter = document.getElementById('filter-status').value;

    // 1. FILTRAR a lista completa PRIMEIRO com todos os filtros
    const filteredShows = allShows.filter(show => {
        const artistMatch = (show.artists || '').toLowerCase().includes(artistFilter);
        const locationMatch = (show.location || '').toLowerCase().includes(locationFilter);
        const dateMatch = !monthFilter || (show.date && show.date.startsWith(monthFilter));
        const statusMatch = !statusFilter || show.status === statusFilter;
        return artistMatch && locationMatch && dateMatch && statusMatch;
    });

    // 2. AGORA, separar a lista JÁ FILTRADA em agendados e histórico
    const filteredAgendados = filteredShows.filter(s => s.status !== 'realizado' && s.status !== 'cancelado').sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`));
    const filteredHistorico = filteredShows.filter(s => s.status === 'realizado' || s.status === 'cancelado').sort((a, b) => new Date(b.date) - new Date(a.date));

    // Lógica para exibir mensagens de "lista vazia"
    const emptyMessageHTML = (title, subtitle) => `
        <div class="text-center py-10 bg-gray-800/50 rounded-lg">
            <p class="text-gray-400 font-semibold">${title}</p>
            <p class="text-gray-500 text-sm mt-2">${subtitle}</p>
        </div>
    `;

    if (filteredAgendados.length === 0) {
        if (artistFilter || locationFilter || monthFilter || statusFilter) {
            showsListAgendados.innerHTML = emptyMessageHTML('Nenhum show agendado encontrado.', 'Tente ajustar seus filtros.');
        } else {
            showsListAgendados.innerHTML = emptyMessageHTML('Nenhum show agendado por enquanto.', 'Clique no botão "+" para adicionar um novo evento.');
        }
    } else {
        filteredAgendados.forEach(show => showsListAgendados.appendChild(createShowElement(show)));
    }

    if (filteredHistorico.length === 0) {
        if (artistFilter || locationFilter || monthFilter || statusFilter) {
            showsListRealizados.innerHTML = emptyMessageHTML('Nenhum evento encontrado no histórico.', 'Tente ajustar seus filtros.');
        } else {
            showsListRealizados.innerHTML = emptyMessageHTML('O histórico de shows está vazio.', 'Eventos realizados ou cancelados aparecerão aqui.');
        }
    } else {
        filteredHistorico.forEach(show => showsListRealizados.appendChild(createShowElement(show)));
    }
    
    lucide.createIcons();
};

             const setupMapFilters = () => {
                const checkboxes = document.querySelectorAll('.map-filter-cb');
                checkboxes.forEach(cb => {
                    cb.addEventListener('change', () => {
                        const status = cb.dataset.status;
                        if (cb.checked) {
                            map.addLayer(layers[status]);
                        } else {
                            map.removeLayer(layers[status]);
                        }
                    });
                });
            };

            const populateMusiciansChecklist = (prefix, selectedMusicians = []) => {
                const listContainer = document.getElementById(`${prefix}-musicians-list`);
                const managerOptions = document.getElementById(`${prefix}-manager-options`);
                const privateEventCheckbox = document.getElementById(`${prefix}-private-event`);
                const musiciansContainer = document.getElementById(`${prefix}-musicians-container`);
                
                listContainer.innerHTML = ''; // Limpa a lista antiga

                if (userSettings.isManager && allTeamMembers.length > 0) {
                    managerOptions.classList.remove('hidden');
                    allTeamMembers.forEach(musico => {
                        const isChecked = selectedMusicians.includes(musico.id);
                        const checkboxHTML = `
                            <label class="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-gray-700">
                                <input type="checkbox" data-uid="${musico.id}" class="musician-checkbox w-5 h-5 bg-gray-900 border-gray-600 text-purple-500 focus:ring-purple-600" ${isChecked ? 'checked' : ''}>
                                <div>
                                    <span class="text-white">${musico.name}</span>
                                    <p class="text-xs text-gray-500">${musico.instrumento}</p>
                                </div>
                            </label>`;
                        listContainer.insertAdjacentHTML('beforeend', checkboxHTML);
                    });
                } else {
                    managerOptions.classList.add('hidden');
                }

                // Lógica para desabilitar músicos se for evento particular
                privateEventCheckbox.addEventListener('change', (e) => {
                    musiciansContainer.classList.toggle('opacity-50', e.target.checked);
                    listContainer.querySelectorAll('input').forEach(input => {
                        input.disabled = e.target.checked;
                        if (e.target.checked) input.checked = false;
                    });
                });
            };
            
      const createShowElement = (show) => {
            const showElement = document.createElement('div');
            showElement.className = "bg-gray-800 rounded-lg p-4 shadow-md flex items-center gap-4 cursor-pointer hover:bg-gray-700/50";
            showElement.dataset.id = show.id;

            const eventType = show.eventType || 'show';
            const typeInfo = eventTypes[eventType] || eventTypes.show;
            const statusInfo = statusMap[show.status] || { text: '', color: ''};
            const statusHTML = show.status ? `<div class="text-xs font-bold py-1 px-2 rounded-full ${statusInfo.color}">${statusInfo.text}</div>` : '';
            
            // Extrai o dia do mês da data
            const dayOfMonth = show.date ? new Date(show.date + 'T00:00:00').getDate() : '';
            const monthShort = show.date ? new Date(show.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' }) : '';

            showElement.innerHTML = `
                <div class="flex flex-col items-center justify-center bg-gray-900/50 p-3 rounded-lg w-16 h-16 text-center shrink-0">
                    <span class="text-2xl font-bold text-white">${dayOfMonth}</span>
                    <span class="text-xs text-gray-400 capitalize">${monthShort}</span>
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <i data-lucide="${typeInfo.icon}" class="w-5 h-5 shrink-0" style="color: ${typeInfo.color};"></i>
                        <h3 class="font-bold text-lg text-white truncate" title="${show.artists}">${show.artists}</h3>
                    </div>
                    
                    ${show.location ? `<p class="text-sm text-gray-400 flex items-center gap-1.5 mt-1 truncate" title="${show.location}"><i data-lucide="map-pin" class="w-4 h-4 shrink-0"></i> ${show.location}</p>` : ''}
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
                    return showDate < today && (show.status === 'confirmado' || show.status === 'aguardando') && show.isPersonal;
                });

                if (pendingPastShows.length > 0) {
                    const showToConfirm = pendingPastShows[0];
                    itemToModifyId = showToConfirm.id;
                    document.getElementById('confirm-status-text').textContent = `O show de ${showToConfirm.artists} em ${showToConfirm.location} (${formatDate(showToConfirm.date)}) foi realizado?`;
                    confirmStatusModal.classList.add('is-open');
                }
            };
            
            const handleUser = async (user) => {
                loadingAuth.classList.add('hidden');
                
                // Limpa os listeners antigos para evitar duplicação
                if (unsubscribeShows) unsubscribeShows.forEach(unsub => unsub());
                if (unsubscribeSetlists) unsubscribeSetlists.forEach(unsub => unsub());
                if (unsubscribeNotifications) unsubscribeNotifications();
                if (unsubscribeTeam) unsubscribeTeam.forEach(unsub => unsub());

                unsubscribeShows = [];
                unsubscribeSetlists = [];
                unsubscribeTeam = [];

                if (user) {
                    currentUser = user;
                    await loadUserSettings(user.uid);

                    loginScreen.style.display = 'none';
                    appContent.style.display = 'block';

                    // --- LÓGICA DE BUSCA DE DADOS CENTRALIZADA ---

                    let personalShows = [], managedShows = [], personalSetlists = [], managedSetlists = [];

                    // Função que será chamada para redesenhar tudo quando qualquer dado mudar
                    const combineAndRenderAll = () => {
                        // Combina shows pessoais e gerenciados
                        allShows = [
                            ...personalShows.map(s => ({ ...s, isPersonal: true })),
                            ...managedShows.map(s => ({ ...s, isPersonal: false }))
                        ];

                        // Combina setlists, removendo duplicatas e priorizando as pessoais
                        allSetlists = [...new Map([...managedSetlists, ...personalSetlists].map(item => [item.id, item])).values()];
                        
                        // Renderiza todas as seções da UI com os dados completos
                        renderShows();
                        renderCalendar();
                        renderDashboard();
                        renderSetlists();
                        renderTeam();
                        populateSetlistDropdowns();

                        // Só checa shows passados se não for um músico gerenciado
                        if (!userSettings.managedBy) {
                            checkPastShows();
                        }
                    };

                    // 1. Busca os shows PESSOAIS
                    const personalShowsPath = `artifacts/${appId}/users/${currentUser.uid}/shows`;
                    unsubscribeShows.push(onSnapshot(query(collection(db, personalShowsPath)), s => {
                        personalShows = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        combineAndRenderAll();
                    }));

                    // 2. Busca as setlists PESSOAIS
                    const personalSetlistsPath = `artifacts/${appId}/users/${currentUser.uid}/setlists`;
                    unsubscribeSetlists.push(onSnapshot(query(collection(db, personalSetlistsPath), orderBy("name", "asc")), s => {
                        personalSetlists = s.docs.map(doc => ({ id: doc.id, ...doc.data(), isPersonal: true }));
                        combineAndRenderAll();
                    }));

                    // 3. Se for um músico vinculado, busca os dados do GERENTE
                    if (userSettings.managedBy) {
                        // Busca shows do gerente onde o músico está vinculado
                        const managedShowsPath = `artifacts/${appId}/users/${userSettings.managedBy}/shows`;
                        const qShows = query(collection(db, managedShowsPath), where("linkedMusicians", "array-contains", currentUser.uid));
                        unsubscribeShows.push(onSnapshot(qShows, s => {
                            managedShows = s.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            combineAndRenderAll();
                        }));

                        // Busca as setlists do gerente
                        const managedSetlistsPath = `artifacts/${appId}/users/${userSettings.managedBy}/setlists`;
                        unsubscribeSetlists.push(onSnapshot(query(collection(db, managedSetlistsPath), orderBy("name", "asc")), s => {
                            managedSetlists = s.docs.map(doc => ({ id: doc.id, ...doc.data(), isPersonal: false }));
                            combineAndRenderAll();
                        }));
                    }

                    // 4. Busca a EQUIPE (lógica permanece a mesma)
                    const managerIdForTeam = userSettings.isManager ? currentUser.uid : userSettings.managedBy;
                    if (managerIdForTeam) {
                        const followersPath = `artifacts/${appId}/users/${managerIdForTeam}/followers`;
                        unsubscribeTeam.push(onSnapshot(collection(db, followersPath), async (snapshot) => {
                            const followerIds = snapshot.docs.map(doc => doc.id);
                            if (followerIds.length === 0) {
                                allTeamMembers = [];
                                combineAndRenderAll();
                                return;
                            }
                            const memberPromises = followerIds.map(id => getDoc(doc(db, `artifacts/${appId}/user_settings`, id)));
                            try {
                                const memberDocs = await Promise.all(memberPromises);
                                allTeamMembers = memberDocs
                                    .filter(docSnap => docSnap.exists())
                                    .map(docSnap => ({
                                        id: docSnap.id,
                                        name: docSnap.data().userName,
                                        instrumento: docSnap.data().instrument
                                    })).sort((a, b) => a.name.localeCompare(b.name));
                            } catch (error) {
                                console.error("Erro ao buscar detalhes dos membros da equipe:", error);
                                allTeamMembers = [];
                            } finally {
                                combineAndRenderAll();
                            }
                        }));
                    } else {
                        allTeamMembers = [];
                        combineAndRenderAll();
                    }
                    
                    // 5. Busca as NOTIFICAÇÕES (lógica permanece a mesma)
                    const notificationsPath = `artifacts/${appId}/users/${currentUser.uid}/notifications`;
                    unsubscribeNotifications = onSnapshot(query(collection(db, notificationsPath), orderBy("timestamp", "desc")), (snapshot) => {
                        allNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        renderNotifications();
                    });

                } else {
                    // Bloco de código para quando o usuário está deslogado
                    currentUser = null;
                    appContent.style.display = 'none';
                    loginContainer.classList.remove('hidden');
                    loginScreen.style.display = 'flex';
                    allShows = [];
                    allSetlists = [];
                    allNotifications = [];
                    renderShows();
                    renderNotifications();
                }
            };
            
        const loadUserSettings = async (uid) => {
          const settingsRef = doc(db, `artifacts/${appId}/user_settings`, uid);
            try {
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    userSettings = docSnap.data();
                    // Atualiza o objeto eventTypes com as cores do usuário, se existirem
                    if(userSettings.eventColors) {
                        for(const type in userSettings.eventColors) {
                            if(eventTypes[type]) {
                                eventTypes[type].color = userSettings.eventColors[type].color;
                                eventTypes[type].calendarBg = userSettings.eventColors[type].calendarBg;
                            }
                        }
                    }
                } else {
                    // Configuração padrão para usuários mais antigos
                    const defaultSettings = { isManager: false, managedBy: null, userName: 'Músico', instrument: 'Não definido' };
                    await setDoc(settingsRef, defaultSettings);
                    userSettings = defaultSettings;
                }
            } catch (error) {
                console.error("Erro ao carregar configurações do usuário:", error);
                userSettings = {};
            } finally {
                updateSettingsUI();
                document.getElementById('profile-name').value = userSettings.userName || '';
                document.getElementById('profile-instrument').value = userSettings.instrument || '';
                // NOVO: Renderiza os seletores de cor com as configurações carregadas
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
                    document.getElementById('artist-name-input').value = userSettings.artistName || '';
                    document.getElementById('invite-code').textContent = currentUser.uid;
                }

                if (userSettings.managedBy) {
                    linkFormEl.classList.add('hidden');
                    managedByInfo.classList.remove('hidden');
                    
                    const managerSettingsRef = doc(db, `artifacts/${appId}/user_settings`, userSettings.managedBy);
                    const managerSnap = await getDoc(managerSettingsRef);
                    const managerName = managerSnap.exists() ? managerSnap.data().artistName : 'Gerente não encontrado';
                    document.getElementById('manager-name-display').textContent = managerName || `Gerente (${userSettings.managedBy.substring(0,6)}...)`;
                } else {
                    linkFormEl.classList.remove('hidden');
                    managedByInfo.classList.add('hidden');
                }

                const instrumentField = document.getElementById('profile-instrument').parentElement;
                instrumentField.classList.toggle('hidden', userSettings.isManager);
            };

            onAuthStateChanged(auth, handleUser);

            loginForm.addEventListener('submit', (e) => e.preventDefault());

            loginBtn.addEventListener('click', () => {
                 const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                if (!email || !password) { showLoginError("Por favor, preencha e-mail e senha."); return; }
                signInWithEmailAndPassword(auth, email, password)
                    .catch(error => {
                        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                            showLoginError("E-mail ou senha inválidos.");
                        } else { showLoginError("Ocorreu um erro ao fazer login."); }
                    });
            });

            
const showRegisterError = (message) => { registerError.textContent = message; registerError.classList.remove('hidden'); };

profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const newName = document.getElementById('profile-name').value;
            const newInstrument = document.getElementById('profile-instrument').value;
            const profileSuccess = document.getElementById('profile-success');

            const settingsRef = doc(db, `artifacts/${appId}/user_settings`, currentUser.uid);
            try {
                await updateDoc(settingsRef, {
                    userName: newName,
                    instrument: newInstrument
                });
                profileSuccess.classList.remove('hidden');
                setTimeout(() => profileSuccess.classList.add('hidden'), 3000); // Esconde a mensagem após 3s
            } catch (err) {
                showError("Não foi possível atualizar o perfil.");
                console.error("Erro ao salvar perfil:", err);
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

registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const instrument = document.getElementById('register-instrument').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            if (!email || !password || !name || !instrument) {
                showRegisterError("Por favor, preencha todos os campos.");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Salva as informações adicionais do perfil no banco de dados
                const settingsRef = doc(db, `artifacts/${appId}/user_settings`, user.uid);
                await setDoc(settingsRef, {
                    userName: name,      // Salva o nome do usuário
                    artistName: name,    // Inicializa o nome do artista com o nome do usuário
                    instrument: instrument,
                    isManager: false,
                    managedBy: null
                });

            } catch (error) {
                if (error.code === 'auth/email-already-in-use') {
                    showRegisterError("Este e-mail já está em uso.");
                } else if (error.code === 'auth/weak-password') {
                    showRegisterError("A senha deve ter pelo menos 6 caracteres.");
                } else {
                    showRegisterError("Ocorreu um erro ao registrar.");
                    console.error(error);
                }
            }
        });
            logoutBtn.addEventListener('click', () => signOut(auth));
            
            addShowForm.addEventListener('submit', async (e) => {
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
                const musicianCheckboxes = document.querySelectorAll('#add-musicians-list input:checked');
                const linkedMusicians = isPrivate ? [] : Array.from(musicianCheckboxes).map(cb => cb.dataset.uid);

const newShowData = { 
    eventType: document.getElementById('add-type').value, // <-- ADICIONE ESTA LINHA
    date, time, artists, location, status, observacoes, setlistId, 
    isManaged: userSettings.isManager && !isPrivate,
    isPrivate: isPrivate,
    linkedMusicians: linkedMusicians,
    createdAt: serverTimestamp() 
};

try {
    const showsCollectionPath = `artifacts/${appId}/users/${currentUser.uid}/shows`;
    await addDoc(collection(db, showsCollectionPath), newShowData);
    addShowForm.reset();
    addModal.classList.remove('is-open');

    if (!isPrivate) {
        notifyLinkedMusicians(linkedMusicians, `Novo show: ${artists} em ${location}`, date, time);
    }
} catch (err) {
    console.error("Erro ao adicionar show:", err);
    showError("Ocorreu um erro ao salvar o show.");
}
});

            filterArtistInput.addEventListener('input', renderShows);
            filterLocationInput.addEventListener('input', renderShows);
            // Adicione esta linha junto com os outros event listeners de filtro
            document.getElementById('filter-status').addEventListener('input', renderShows);
            
            const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
            const filtersContainer = document.getElementById('filters-container');
            toggleFiltersBtn.addEventListener('click', () => {
                const isHidden = filtersContainer.classList.toggle('hidden');
                document.getElementById('toggle-filters-text').textContent = isHidden ? 'Exibir Filtros' : 'Ocultar Filtros';
            });

            document.getElementById('filter-month').addEventListener('input', renderShows);

            openAddModalBtn.addEventListener('click', () => {
                if(userSettings.isManager && userSettings.artistName) {
                    document.getElementById('add-artists').value = userSettings.artistName;
                }
                populateMusiciansChecklist('add');
                addModal.classList.add('is-open');
            });
            cancelAddBtn.addEventListener('click', () => addModal.classList.remove('is-open'));

            const allListsContainer = document.getElementById('app-content');
            allListsContainer.addEventListener('click', (e) => {
                const showCard = e.target.closest('[data-id]');
                if (showCard && (showCard.parentElement.id === 'shows-list-agendados' || showCard.parentElement.id === 'shows-list-realizados')) {
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
    } else if (itemTypeToDelete === 'musico') { // ADICIONAR ESTE ELSE IF
        collectionName = 'team';
    } else {
        return;
    }

    // O restante do código permanece o mesmo, mas a notificação pode ser ajustada
    const showToDelete = allShows.find(s => s.id === itemToModifyId && s.isPersonal);

    try {
        const docPath = `artifacts/${appId}/users/${currentUser.uid}/${collectionName}/${itemToModifyId}`;
        await deleteDoc(doc(db, docPath));
        deleteModal.classList.remove('is-open');

        if (showToDelete && collectionName === 'shows') {
           notifyLinkedMusicians(`Show cancelado/removido: ${showToDelete.artists} em ${showToDelete.location}`, showToDelete.date, showToDelete.time);
        }
        itemToModifyId = null;
        itemTypeToDelete = ''; // Limpar o tipo
    } catch (err) {
        showError(`Não foi possível excluir o item.`);
        deleteModal.classList.remove('is-open');
    }
});

            cancelDeleteBtn.addEventListener('click', () => { deleteModal.classList.remove('is-open'); itemToModifyId = null; });

            editShowForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!currentUser || !itemToModifyId) return;
                const isPrivate = document.getElementById('edit-private-event').checked;
                const musicianCheckboxes = document.querySelectorAll('#edit-musicians-list input:checked');
                const linkedMusicians = isPrivate ? [] : Array.from(musicianCheckboxes).map(cb => cb.dataset.uid);

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
                    linkedMusicians: linkedMusicians
                };
                try {
                    const ownerId = currentUser.uid;
                    const showDocPath = `artifacts/${appId}/users/${ownerId}/shows/${itemToModifyId}`;
                    await updateDoc(doc(db, showDocPath), updatedData);
                    editModal.classList.remove('is-open');
                    itemToModifyId = null;
                    if (!isPrivate) {
                    notifyLinkedMusicians(linkedMusicians, `Show atualizado: ${updatedData.artists} em ${updatedData.location}`, updatedData.date, updatedData.time);
                    }
                } catch (err) {
                    showError("Não foi possível salvar as alterações.");
                }
            });

            cancelEditBtn.addEventListener('click', () => { editModal.classList.remove('is-open'); itemToModifyId = null; });

            // NOVO: Listener para o botão de salvar cores
            document.getElementById('save-colors-btn').addEventListener('click', async () => {
                if (!currentUser) return;

                const newColorSettings = {};
                const pickers = document.querySelectorAll('#event-colors-container input[type="color"]');

                pickers.forEach(picker => {
                    const type = picker.dataset.type;
                    const prop = picker.dataset.prop;
                    if (!newColorSettings[type]) {
                        newColorSettings[type] = {};
                    }
                    newColorSettings[type][prop] = picker.value;
                });

                const settingsRef = doc(db, `artifacts/${appId}/user_settings`, currentUser.uid);
                try {
                    await updateDoc(settingsRef, {
                        eventColors: newColorSettings
                    });
                    
                    // Recarrega as configurações para aplicar as cores em toda a UI
                    await loadUserSettings(currentUser.uid);
                    renderCalendar();
                    renderShows();
                    
                    const successBanner = document.getElementById('colors-success');
                    successBanner.classList.remove('hidden');
                    setTimeout(() => successBanner.classList.add('hidden'), 3000);

                } catch (err) {
                    showError("Não foi possível salvar as cores.");
                    console.error("Erro ao salvar cores:", err);
                }
            });
            
            const updatePastShowStatus = async (status) => {
                if (!currentUser || !itemToModifyId) return;
                try {
                    const ownerId = currentUser.uid;
                    const showDocPath = `artifacts/${appId}/users/${ownerId}/shows/${itemToModifyId}`;
                    await updateDoc(doc(db, showDocPath), { status: status });
                    confirmStatusModal.classList.remove('is-open');
                    itemToModifyId = null;
                    checkPastShows();
                } catch (err) {
                    showError("Não foi possível atualizar o status do show.");
                }
            };

            confirmRealizadoBtn.addEventListener('click', () => updatePastShowStatus('realizado'));
            confirmCanceladoBtn.addEventListener('click', () => updatePastShowStatus('cancelado'));

            const tabs = [tabAgenda, tabCalendario, tabSetlists, tabEquipe, tabDashboard, tabConfiguracoes]; // Adicionar tabEquipe
            const views = [viewAgenda, viewCalendario, viewSetlists, viewEquipe, viewDashboard, viewConfiguracoes]; // Adicionar viewEquipe
            tabs.forEach((tab, index) => {
               tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('tab-active'));
                    views.forEach(v => v.classList.add('hidden'));
                    tab.classList.add('tab-active');
                    views[index].classList.remove('hidden');
                    lucide.createIcons();
                    if(views[index].id === 'view-dashboard') {
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
                monthYearTitle.textContent = `${currentCalendarDate.toLocaleString('pt-BR', { month: 'long' })} ${year}`;
                const firstDayOfMonth = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                for (let i = 0; i < firstDayOfMonth; i++) { calendarGrid.insertAdjacentHTML('beforeend', '<div></div>'); }
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const showsOnDay = allShows.filter(s => s.date === dateStr);
                let dayClass = '';
                let dayStyle = '';
                if (showsOnDay.length > 0) {
                    const eventType = showsOnDay[0].eventType || 'show';
                    const typeInfo = eventTypes[eventType] || eventTypes.show;
                    dayClass = 'has-event';
                    dayStyle = `style="background-color: ${typeInfo.calendarBg};"`;
                }
                calendarGrid.insertAdjacentHTML('beforeend', `<div data-date="${dateStr}" class="calendar-day p-2 cursor-pointer hover:bg-gray-700 rounded-full ${dayClass}" ${dayStyle}>${day}</div>`);
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

            calendarGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('calendar-day') && e.target.dataset.date) {
                    document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
                    e.target.classList.add('selected');
                    const dateStr = e.target.dataset.date;
                    const showsOnDay = allShows.filter(s => s.date === dateStr);
                    calendarShowDetails.innerHTML = '';
                    if (showsOnDay.length > 0) {
                        showsOnDay.forEach(show => {
                            const statusInfo = statusMap[show.status] || { text: '', color: ''};
                            const statusHTML = show.status ? `<div class="text-xs font-bold py-1 px-2 rounded-full ${statusInfo.color}">${statusInfo.text}</div>` : '';
                            const showCard = document.createElement('div');
                            showCard.className = "bg-gray-800 rounded-lg p-4 cursor-pointer";
                            showCard.innerHTML = `<div class="flex justify-between items-start"><p class="font-bold text-purple-300 pointer-events-none">${show.artists}</p>${statusHTML}</div><p class="text-sm text-gray-400 mt-1 pointer-events-none">${show.location}</p>`;
                            showCard.addEventListener('click', () => openShowDetailsModal(show.id));
                            calendarShowDetails.appendChild(showCard);
                        });
                    } else { calendarShowDetails.innerHTML = `<p class="text-center text-gray-500">Nenhum show neste dia.</p>`; }
                }
            });

            const renderDashboard = () => {
                renderMap()
                renderShowsPerMonth();
                renderTopLocations();
                renderTopSetlists();
            };
 const renderShowsPerMonth = () => {
                const ctx = document.getElementById('shows-per-month-chart').getContext('2d');
                const labels = [];
                const data = [];
                const now = new Date();
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    labels.push(date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }));
                    const monthShows = allShows.filter(s => {
                        const showDate = new Date(s.date + 'T00:00:00');
                        return showDate.getFullYear() === date.getFullYear() && showDate.getMonth() === date.getMonth();
                    });
                    data.push(monthShows.length);
                }
                if (showsPerMonthChart) showsPerMonthChart.destroy();
                showsPerMonthChart = new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ label: 'Nº de Shows', data, backgroundColor: '#8b5cf6' }] }, options: { scales: { y: { beginAtZero: true, ticks: { color: '#9ca3af', stepSize: 1 } }, x: { ticks: { color: '#9ca3af' } } }, plugins: { legend: { labels: { color: '#9ca3af' } } } } });
            };

            const renderTopLocations = () => {
                const ctx = document.getElementById('top-locations-chart').getContext('2d');
                const locationCounts = {};
                allShows.forEach(show => {
                    const location = (show.location || 'N/A').trim();
                    if (location) { locationCounts[location] = (locationCounts[location] || 0) + 1; }
                });
                const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                const labels = sortedLocations.map(a => a[0]);
                const data = sortedLocations.map(a => a[1]);
                if (topLocationsChart) topLocationsChart.destroy();
                topLocationsChart = new Chart(ctx, { type: 'pie', data: { labels, datasets: [{ data, backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6'] }] }, options: { plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } } } });
            };

            const renderTopSetlists = () => {
                const ctx = document.getElementById('top-setlists-chart').getContext('2d');
                const setlistCounts = {};
                allShows.forEach(show => {
                    if (show.setlistId) { setlistCounts[show.setlistId] = (setlistCounts[show.setlistId] || 0) + 1; }
                });
                const sortedSetlists = Object.entries(setlistCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
                const labels = sortedSetlists.map(s => {
                    const setlist = allSetlists.find(sl => sl.id === s[0]);
                    return setlist ? setlist.name : 'Desconhecida';
                });
                const data = sortedSetlists.map(s => s[1]);
                if (topSetlistsChart) topSetlistsChart.destroy();
                topSetlistsChart = new Chart(ctx, { type: 'pie', data: { labels, datasets: [{ data, backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#6d28d9', '#5b21b6'] }] }, options: { plugins: { legend: { position: 'right', labels: { color: '#9ca3af' } } } } });
            };

            const setlistsList = document.getElementById('setlists-list');
            const emptySetlistState = document.getElementById('empty-setlist-state');

            // --- Funções da Equipe ---

const renderTeam = () => {
                const equipeList = document.getElementById('equipe-list');
                const emptyState = document.getElementById('empty-equipe-state');
                const emptySubtext = document.getElementById('empty-equipe-subtext');

                equipeList.innerHTML = '';
                
                if (userSettings.isManager) {
                    emptySubtext.textContent = "Sua equipe é formada pelos músicos que se vinculam a você usando seu código de convite.";
                } else if (userSettings.managedBy) {
                    emptySubtext.textContent = "Esta é a equipe do seu gerente.";
                } else {
                     emptySubtext.textContent = "Vincule-se a um gerente para ver uma equipe.";
                }
                
                emptyState.classList.toggle('hidden', allTeamMembers.length > 0);

                allTeamMembers.forEach(musico => {
                    const musicoElement = document.createElement('div');
                    musicoElement.className = "bg-gray-800 rounded-lg p-5 shadow-md flex justify-between items-center";
                    
                    musicoElement.innerHTML = `
                        <div>
                            <h3 class="text-xl font-bold text-blue-300">${musico.name}</h3>
                            <p class="text-gray-400">${musico.instrumento || 'Instrumento não definido'}</p>
                        </div>`;
                    equipeList.appendChild(musicoElement);
                });
                lucide.createIcons();
            };

// const openEquipeModal = (id = null) => {
//     const form = document.getElementById('equipe-form');
//     form.reset();
//     document.getElementById('musico-id').value = id || '';
//     const title = document.getElementById('equipe-modal-title');
//     if (id) {
//         title.innerHTML = '<i data-lucide="pencil" class="text-yellow-400"></i> Editar Músico';
//         const musicoData = allTeamMembers.find(m => m.id === id);
//         if (musicoData) {
//             document.getElementById('musico-name').value = musicoData.name;
//             document.getElementById('musico-instrumento').value = musicoData.instrumento;
//         }
//     } else {
//         title.innerHTML = '<i data-lucide="plus-circle" class="text-blue-400"></i> Novo Músico';
//     }
//     lucide.createIcons();
//     equipeModal.classList.add('is-open');
// };

// // --- Event Listeners da Equipe ---

// document.getElementById('open-add-musico-modal-btn').addEventListener('click', () => openEquipeModal());
// document.getElementById('cancel-equipe-btn').addEventListener('click', () => equipeModal.classList.remove('is-open'));

// document.getElementById('equipe-form').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     if (!currentUser || !userSettings.isManager) return;
    
//     const id = document.getElementById('musico-id').value;
//     const data = {
//         name: document.getElementById('musico-name').value,
//         instrumento: document.getElementById('musico-instrumento').value
//     };
    
//     const collectionPath = `artifacts/${appId}/users/${currentUser.uid}/team`;
//     try {
//         if (id) {
//             await updateDoc(doc(db, collectionPath, id), data);
//         } else {
//             await addDoc(collection(db, collectionPath), { ...data, createdAt: serverTimestamp() });
//         }
//         equipeModal.classList.remove('is-open');
//     } catch (err) {
//         showError("Não foi possível salvar os dados do músico.");
//         console.error("Erro ao salvar músico:", err);
//     }
// });

// document.getElementById('equipe-list').addEventListener('click', (e) => {
//     const editBtn = e.target.closest('.edit-musico-btn');
//     const deleteBtn = e.target.closest('.delete-musico-btn');
//     if (editBtn) {
//         openEquipeModal(editBtn.dataset.id);
//     }
//     if (deleteBtn) {
//         itemToModifyId = deleteBtn.dataset.id;
//         itemTypeToDelete = 'musico';
//         const musico = allTeamMembers.find(m => m.id === itemToModifyId);
//         document.getElementById('delete-confirm-text').textContent = `Tem certeza que deseja excluir "${musico.name}" da equipe?`;
//         deleteModal.classList.add('is-open');
//     }
// });
            
            const renderSetlists = () => {
                 setlistsList.innerHTML = '';
                emptySetlistState.classList.toggle('hidden', allSetlists.length > 0);
                allSetlists.forEach(setlist => {
                    const setlistElement = document.createElement('div');
                    setlistElement.className = "bg-gray-800 rounded-lg p-5 shadow-md";
                    setlistElement.dataset.type = 'setlist-card';
                    const songsHTML = (setlist.songs || '').split('\n').map(song => `<li class="text-gray-400">${song}</li>`).join('');
                    const actionButtons = !userSettings.managedBy || setlist.isPersonal ? `
                        <div class="flex gap-2">
                            <button data-id="${setlist.id}" class="edit-setlist-btn bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 p-2 rounded-full"><i data-lucide="pencil" class="w-5 h-5 pointer-events-none"></i></button>
                            <button data-id="${setlist.id}" class="delete-setlist-btn bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-full"><i data-lucide="trash-2" class="w-5 h-5 pointer-events-none"></i></button>
                        </div>
                    ` : '';
                    setlistElement.innerHTML = `
                        <div class="flex justify-between items-start">
                            <h3 class="text-xl font-bold text-green-300">${setlist.name}</h3>
                            ${actionButtons}
                        </div>
                        <ul class="list-disc list-inside mt-2">${songsHTML}</ul>`;
                    setlistsList.appendChild(setlistElement);
                });
                lucide.createIcons();
            };
            
            setlistsList.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-setlist-btn');
                const deleteBtn = e.target.closest('.delete-setlist-btn');
                if(editBtn) {
                    openSetlistModal(editBtn.dataset.id);
                }
                if(deleteBtn) {
                    itemToModifyId = deleteBtn.dataset.id;
                    itemTypeToDelete = 'setlist';
                    document.getElementById('delete-confirm-text').textContent = "Tem certeza que deseja excluir esta setlist?";
                    deleteModal.classList.add('is-open');
                }
            });

            const openSetlistModal = (id = null) => {
                 setlistForm.reset();
                document.getElementById('setlist-id').value = id || '';
                const title = document.getElementById('setlist-modal-title');
                if (id) {
                    title.innerHTML = '<i data-lucide="pencil" class="text-yellow-400"></i> Editar Setlist';
                    const setlistData = allSetlists.find(s => s.id === id);
                    if (setlistData) {
                        document.getElementById('setlist-name').value = setlistData.name;
                        document.getElementById('setlist-songs').value = setlistData.songs;
                    }
                } else {
                    title.innerHTML = '<i data-lucide="plus-circle" class="text-green-400"></i> Nova Setlist';
                }
                lucide.createIcons();
                setlistModal.classList.add('is-open');
            };

            openAddSetlistModalBtn.addEventListener('click', () => openSetlistModal());
            cancelSetlistBtn.addEventListener('click', () => setlistModal.classList.remove('is-open'));
setlistForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!currentUser) return;
                const id = document.getElementById('setlist-id').value;
                const data = {
                    name: document.getElementById('setlist-name').value,
                    songs: document.getElementById('setlist-songs').value
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
                    showError("Não foi possível salvar a setlist.");
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

                // Define uma fonte padrão que já vem com a biblioteca
                doc.setFont("Helvetica", "normal");

                const artistFilter = filterArtistInput.value;
                const locationFilter = filterLocationInput.value;
                const monthFilter = document.getElementById('filter-month').value;
                
                const agendados = allShows.filter(s => s.status !== 'realizado' && s.status !== 'cancelado')
                    .filter(show => {
                        const artistMatch = (show.artists || '').toLowerCase().includes(artistFilter.toLowerCase());
                        const locationMatch = (show.location || '').toLowerCase().includes(locationFilter.toLowerCase());
                        const dateMatch = !monthFilter || (show.date && show.date.startsWith(monthFilter));
                        return artistMatch && locationMatch && dateMatch;
                    })
                    .sort((a, b) => new Date(`${a.date}T${a.time || '00:00'}`) - new Date(`${b.date}T${b.time || '00:00'}`));

                doc.setFontSize(18);
                doc.text("Agenda de Shows", 14, 22);
                
                let y = 40;
                doc.setFontSize(14);
                doc.text("Eventos Agendados", 14, y);
                y += 10;

                agendados.forEach(show => {
                    if (y > 280) { 
                        doc.addPage();
                        y = 20; 
                    }
                    
                    const eventType = show.eventType || 'show';
                    const typeInfo = eventTypes[eventType] || eventTypes.show;
                    const timeText = show.time ? ` às ${show.time}` : '';

                    // Usa prefixos de texto em vez de emojis
                    const titleText = `[${typeInfo.text}] ${formatDate(show.date)}${timeText} - ${show.artists}`;
                    
                    doc.setFontSize(12);
                    doc.setFont("Helvetica", "bold"); // Título em negrito
                    doc.text(titleText, 14, y);
                    y += 8;
                    
                    doc.setFont("Helvetica", "normal"); // Resto do texto normal
                    doc.setFontSize(10);
                    
                    if (show.location) {
                        doc.text(`Local: ${show.location}`, 16, y);
                        y += 6;
                    }
                    
                    if (show.observacoes) {
                        // A função splitTextToSize é mais segura para evitar erros
                        const lines = doc.splitTextToSize(`Obs: ${show.observacoes}`, 180);
                        doc.text(lines, 16, y);
                        y += (lines.length * 5);
                    }
                    
                    y += 12; // Aumentado o espaçamento final entre os eventos
                });

                doc.save("AGENDA-EVENTOS.pdf");
            });
            managerModeToggle.addEventListener('change', async (e) => {
                const isManager = e.target.checked;
                const settingsRef = doc(db, `artifacts/${appId}/user_settings`, currentUser.uid);
                try {
                    await setDoc(settingsRef, { isManager }, { merge: true });
                    await handleUser(currentUser); 
                } catch (err) {
                    showError("Não foi possível alterar o modo.");
                }
            });

            artistNameInput.addEventListener('blur', async (e) => {
                const artistName = e.target.value;
                 const settingsRef = doc(db, `artifacts/${appId}/user_settings`, currentUser.uid);
                try {
                    await setDoc(settingsRef, { artistName }, { merge: true });
                    userSettings.artistName = artistName;
                } catch (err) {
                    showError("Não foi possível salvar o nome do artista.");
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

linkForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const managerId = document.getElementById('manager-code-input').value.trim();
                if (!managerId || !currentUser) return;
                
                const musicianSettingsRef = doc(db, `artifacts/${appId}/user_settings`, currentUser.uid);
                // NOVO: Referência para a lista de seguidores do gerente
                const followerRef = doc(db, `artifacts/${appId}/users/${managerId}/followers`, currentUser.uid);

                try {
                    // Passo 1: O músico atualiza seu próprio status
                    await setDoc(musicianSettingsRef, { managedBy: managerId }, { merge: true });
                    // NOVO Passo 2: O músico se adiciona na lista de seguidores do gerente
                    await setDoc(followerRef, { joinedAt: serverTimestamp() });
                    
                    await handleUser(currentUser);
                } catch (err) {
                    console.error("Erro ao vincular conta:", err);
                    showError("Não foi possível vincular a conta. Verifique o código.");
                }
            });

unlinkBtn.addEventListener('click', async () => {
                if (!currentUser || !userSettings.managedBy) return;

                // --- INÍCIO DA CORREÇÃO ---
                // Passo 1: Para de ouvir TODOS os listeners de dados existentes.
                // Isso evita o erro de permissão, pois o app não estará mais escutando
                // a agenda do gerente quando a permissão for revogada.
                if (unsubscribeShows) unsubscribeShows.forEach(unsub => unsub());
                if (unsubscribeSetlists) unsubscribeSetlists.forEach(unsub => unsub());
                unsubscribeShows = [];
                unsubscribeSetlists = [];
                // --- FIM DA CORREÇÃO ---

                const musicianSettingsRef = doc(db, `artifacts/${appId}/user_settings`, currentUser.uid);
                const followerRef = doc(db, `artifacts/${appId}/users/${userSettings.managedBy}/followers`, currentUser.uid);

                try {
                    // Passo 2: Agora, atualiza o banco de dados com segurança.
                    await updateDoc(musicianSettingsRef, { managedBy: deleteField() });
                    await deleteDoc(followerRef);
                    
                    // Passo 3: Recarrega o estado do usuário para reativar os listeners corretos (apenas os pessoais).
                    await handleUser(currentUser); 
                } catch (err) {
                    console.error("Erro ao desvincular:", err);
                    showError("Não foi possível desvincular a conta.");
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

            notificationsBellContainer.addEventListener('click', (e) => {
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
        });

        const manifest = { 
            "name": "Banda Sync - Agenda de Shows", 
            "short_name": "Banda Sync", 
            "start_url": "./", 
            "display": "standalone", 
            "background_color": "#111827", 
            "theme_color": "#111827", 
            "description": "Sua agenda de shows pessoal.", 
            "icons": [
                { 
                  "src": "https://raw.githubusercontent.com/LucasSantosTaqua2/agenda-musico/refs/heads/main/img/logo192.png", 
                  "sizes": "192x192", 
                  "type": "image/png" 
                }, 
                { 
                  "src": "https://raw.githubusercontent.com/LucasSantosTaqua2/agenda-musico/refs/heads/main/img/logo512.png", 
                  "sizes": "512x512", 
                  "type": "image/png" 
                }
            ] 
        };
        const manifestString = JSON.stringify(manifest);
        const manifestUri = 'data:application/manifest+json,' + encodeURIComponent(manifestString);
        document.getElementById('manifest-link').href = manifestUri;

  });
