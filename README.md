# Banda Sync 🎵

![Versão](https://img.shields.io/badge/version-1.0.1-blue.svg)
![Licença](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-ativo-brightgreen.svg)

<div align="center">
  <img src="https://raw.githubusercontent.com/LucasSantosTaqua2/agenda-musico/refs/heads/main/img/logo1080.png" alt="Logo da Banda Sync" width="250"/>
</div>

<p align="center">
  Uma aplicação web completa para gerenciamento de agendas, setlists e comunicação de músicos e bandas.
  <br />
  <a href="#-sobre-o-projeto"><strong>Saiba mais »</strong></a>
  <br />
  <br />
  <a href="https://bandasync.com.br"><strong>Acessar a Aplicação</strong></a>
  ·
  <a href="https://github.com/LucasSantosTaqua2/banda-sync/issues">Reportar Bug</a>
</p>

---

## 📋 Tabela de Conteúdos

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades Principais](#-funcionalidades-principais)
* [Telas da Aplicação](#-telas-da-aplicação)
* [Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [Como Usar](#-como-usar)

---

## 🎵 Sobre o Projeto

**Banda Sync** é uma aplicação web progressiva (PWA) projetada para ser a ferramenta definitiva para músicos, bandas e seus empresários. Ela centraliza todas as informações importantes, desde a agenda de shows e gestão de repertório até a comunicação da equipe em tempo real.

O sistema foi construído para ser intuitivo, rápido e acessível de qualquer dispositivo, podendo ser instalado no celular ou desktop para uma experiência de aplicativo nativo.

**Acesse a versão ao vivo em:** [**bandasync.com.br**](https://bandasync.com.br)

---

## ✨ Funcionalidades Principais

* **🗓️ Agenda Completa:**
    * Visualize shows futuros em "Agendados" e passados em "Histórico" com paginação.
    * Cadastre novos eventos com detalhes como data, local, status e observações.
    * Filtre a agenda por artista, local ou mês.
    * Exporte a agenda para **PDF** com um clique.

* **💬 Comunicação em Tempo Real:**
    * **Comentários por Evento:** Discuta detalhes, logística e qualquer assunto pertinente dentro de cada evento. As mensagens são atualizadas em tempo real para todos os membros vinculados.
    * **Notificações:** Gerentes podem notificar músicos sobre shows novos ou atualizados, garantindo que toda a equipe esteja sempre sincronizada.

* **🎼 Gerenciador de Setlists:**
    * Crie, edite e organize múltiplas setlists.
    * Associe uma setlist a um evento e faça o download em **PDF**.

* **🤝 Modo Gerente e Equipe:**
    * Um usuário pode atuar como gerente, administrando a agenda de vários músicos vinculados através de um código de convite.
    * Músicos podem visualizar a agenda compartilhada por seu gerente.

* **📊 Dashboard com Analytics:**
    * **Gráficos** de shows por mês e locais mais frequentes.
    * **Mapa de Shows Interativo** com pinos coloridos por tipo de evento, com filtros e zoom automático para a região dos eventos.

* **🎨 Segurança e Personalização:**
    * **Autenticação Segura:** Sistema de login completo com funcionalidade de **redefinição de senha** por e-mail.
    * **Personalização de Cores:** Altere as cores de cada tipo de evento para customizar a aparência da sua agenda e calendário.

* **📱 PWA (Progressive Web App):**
    * Instale o aplicativo na tela inicial do seu celular ou desktop para acesso rápido e funcionalidades offline.

---

## 📸 Telas da Aplicação

<div align="center">
  <br><br>
  <p>Tela Inicial.</p>
  <img src="https://raw.githubusercontent.com/LucasSantosTaqua2/banda-sync/refs/heads/main/img/testes/inicial.png" alt="Tela inicial" width="300"/>
</div>

<div align="center">
  <br><br>
  <p>Tela do Calendário.</p>
  <img src="https://raw.githubusercontent.com/LucasSantosTaqua2/banda-sync/refs/heads/main/img/testes/calendario.png" alt="Calendário" width="300"/>
</div>

<div align="center">
  <br><br>
  <p>Visão do Dashboard no celular, com o mapa de shows responsivo.</p>
  <img src="https://raw.githubusercontent.com/LucasSantosTaqua2/banda-sync/refs/heads/main/img/testes/dash.png" alt="Dashboard" width="300"/>
</div>

<div align="center">
  <br><br>
  <p>Tela de configurações.</p>
  <img src="https://raw.githubusercontent.com/LucasSantosTaqua2/banda-sync/refs/heads/main/img/testes/config.png" alt="Configurações" width="300"/>
</div>

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

* **Frontend:**
    * `HTML5` | `CSS3` | `JavaScript (ES6+)`
    * **Tailwind CSS:** Framework de estilização.
    * **Lucide Icons:** Biblioteca de ícones.

* **Backend & Database:**
    * **Firebase:** Autenticação, Banco de Dados Firestore e Notificações.

* **Bibliotecas JavaScript:**
    * **Chart.js:** Gráficos para o dashboard.
    * **Leaflet.js:** Mapa interativo.
    * **jsPDF:** Exportação de PDFs.

---

## 🚀 Como Usar

A aplicação está disponível publicamente. Siga os passos abaixo para começar a organizar sua carreira musical:

* **1. Crie sua Conta:**
  * Acesse o site: bandasync.com.br.
  * Na tela de login, clique em "Registre-se".
  * Preencha seus dados (nome, instrumento, e-mail e senha) e crie sua conta. Caso esqueça sua senha, utilize a opção "Esqueci minha senha".

* **2. Adicione e Gerencie seus Eventos:**
  * Na tela de Agenda, clique no botão `+` para adicionar um novo evento (show, ensaio, etc.).
  * Preencha todas as informações, como data, local, status e observações.
  * Use os filtros para visualizar eventos específicos e exporte sua agenda para PDF a qualquer momento.

* **3. Comunique-se com a Equipe:**
  * Clique em um evento para ver os detalhes e use a seção de **comentários** para alinhar informações com os outros músicos.

* **4. Crie suas Setlists:**
  * Navegue até a aba Setlists.
  * Clique em "Criar Nova Setlist", dê um nome e adicione as músicas do seu repertório, uma por linha.
  * Você pode associar uma setlist a um evento e fazer o download em PDF.

* **5. Explore o Modo Gerente:**
  * Se você é um gerente: Vá em Configurações, ative o "Modo Gerente" e compartilhe seu código de convite com os músicos da sua equipe.
  * Se você é um músico: Insira o código do seu gerente na tela de Configurações para vincular sua agenda à dele.

* **6. Instale o Aplicativo (PWA):**
  * Para um acesso rápido, instale o Banda Sync no seu celular ou desktop. Procure pelo ícone de instalação na barra de endereço do seu navegador e selecione "Instalar" ou "Adicionar à Tela de Início".
---

<p align="center">Desenvolvido de músico para músico por Lucas Santos</p>
