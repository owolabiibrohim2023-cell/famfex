/**
 * Famfex Construction Company - Core Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // 2. Quote Modal Handlers
  const openQuoteBtns = document.querySelectorAll('.open-quote-modal');
  const quoteModal = document.getElementById('quoteModal');
  const closeQuoteModal = document.getElementById('closeQuoteModal');

  if (quoteModal) {
    openQuoteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        quoteModal.style.display = 'flex';
      });
    });

    if (closeQuoteModal) {
      closeQuoteModal.addEventListener('click', () => {
        quoteModal.style.display = 'none';
      });
    }

    window.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        quoteModal.style.display = 'none';
      }
    });
  }

  // 3. Quick Quote Form Submission & WhatsApp Forwarding
  const quickQuoteForm = document.getElementById('quickQuoteForm');
  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('qName')?.value || 'Client';
      const phone = document.getElementById('qPhone')?.value || '';
      const service = document.getElementById('qService')?.value || 'General Construction';
      const details = document.getElementById('qDetails')?.value || 'Interested in consultation';

      const message = `Hello Famfex Construction Company! My name is ${name} (${phone}). I would like a quote/consultation for: ${service}. Details: ${details}`;
      const whatsappUrl = `https://wa.me/2348033823100?text=${encodeURIComponent(message)}`;

      // Show temporary alert/feedback then redirect to WhatsApp
      const alertBox = document.getElementById('quoteNotice');
      if (alertBox) {
        alertBox.style.display = 'block';
        alertBox.innerHTML = '<strong>Request Processed!</strong> Redirecting you to WhatsApp to connect directly with our chief project engineer...';
      }

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        if (quoteModal) quoteModal.style.display = 'none';
        quickQuoteForm.reset();
        if (alertBox) alertBox.style.display = 'none';
      }, 1200);
    });
  }

  // 4. Contact Form Handler (Contact Page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const phone = document.getElementById('contactPhone').value;
      const subject = document.getElementById('contactSubject').value;
      const msg = document.getElementById('contactMessage').value;

      const fullMessage = `Hello Famfex Construction Company,%0A%0AMy Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ASubject: ${encodeURIComponent(subject)}%0AMessage: ${encodeURIComponent(msg)}`;

      const notice = document.getElementById('contactNotice');
      if (notice) {
        notice.style.display = 'block';
        notice.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        window.open(`https://wa.me/2348033823100?text=${fullMessage}`, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  // 5. Careers & Job Application System (Careers Page)
  const jobForm = document.getElementById('jobApplicationForm');
  if (jobForm) {
    const applicationEndpoint = 'https://formsubmit.co/ajax/famfexconsult2@gmail.com';
    // If URL has ?job=xxx, pre-select it
    const urlParams = new URLSearchParams(window.location.search);
    const selectedJob = urlParams.get('job');
    if (selectedJob && document.getElementById('appRole')) {
      document.getElementById('appRole').value = selectedJob;
      const appSection = document.getElementById('applySection');
      if (appSection) {
        appSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    jobForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fullName = document.getElementById('appFullName').value;
      const email = document.getElementById('appEmail').value;
      const phone = document.getElementById('appPhone').value;
      const role = document.getElementById('appRole').value;
      const experience = document.getElementById('appExperience').value;
      const location = document.getElementById('appLocation').value;
      const resumeFile = document.getElementById('appResume').files[0];
      const fileName = resumeFile ? resumeFile.name : 'Attached via chat';
      const cover = document.getElementById('appCover').value;

      if (resumeFile && resumeFile.size > 10 * 1024 * 1024) {
        const status = document.getElementById('jobFormStatus');
        if (status) {
          status.className = 'form-status error';
          status.textContent = 'Your CV is larger than 10MB. Please choose a smaller file and try again.';
        }
        return;
      }

      // Generate Reference Code
      const refCode = 'FAM-' + Math.floor(100000 + Math.random() * 900000);

      const referenceInput = document.getElementById('appReference');
      if (referenceInput) referenceInput.value = refCode;
      const replyToInput = document.getElementById('appReplyTo');
      if (replyToInput) replyToInput.value = email;

      const submitButton = document.getElementById('jobSubmitButton');
      const status = document.getElementById('jobFormStatus');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending Application...';
      }
      if (status) {
        status.className = 'form-status';
        status.textContent = 'Sending your application and CV to the Famfex recruitment desk...';
      }

      try {
        const response = await fetch(applicationEndpoint, {
          method: 'POST',
          body: new FormData(jobForm),
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) throw new Error('Application email could not be sent.');
      } catch (error) {
        console.error('Application email error:', error);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Job Application System';
        }
        if (status) {
          status.className = 'form-status error';
          status.textContent = 'We could not send your application right now. Please try again or contact HR on WhatsApp.';
        }
        return;
      }

      // Save to localStorage so applicant can see their submitted status
      const applicationData = {
        refCode,
        fullName,
        role,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'Under Review'
      };

      try {
        const history = JSON.parse(localStorage.getItem('famfex_applications') || '[]');
        history.unshift(applicationData);
        localStorage.setItem('famfex_applications', JSON.stringify(history));
        renderApplicationHistory();
      } catch (err) {
        console.error('Storage error', err);
      }

      // Show success banner
      const successNotice = document.getElementById('appSuccessNotice');
      if (successNotice) {
        successNotice.style.display = 'block';
        document.getElementById('appRefDisplay').innerText = refCode;
        successNotice.scrollIntoView({ behavior: 'smooth' });
      }

      if (status) {
        status.className = 'form-status success';
        status.textContent = 'Application sent successfully to famfexconsult2@gmail.com.';
      }

      // WhatsApp Quick Sync Link
      const waBtn = document.getElementById('sendAppWhatsApp');
      if (waBtn) {
        const waMsg = `Hello Famfex HR & Management, I have submitted an official job application for the role of *${role}*.%0A%0A• Reference ID: *${refCode}*%0A• Candidate Name: *${fullName}*%0A• Phone: *${phone}*%0A• Experience: *${experience}*%0A• Location: *${location}*%0A• Resume: *${fileName}*%0A%0AI look forward to the interview stage.`;
        waBtn.href = `https://wa.me/2348033823100?text=${waMsg}`;
      }

      jobForm.reset();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Job Application System';
      }
    });

    renderApplicationHistory();
  }
});

// Helper to render candidate application history
function renderApplicationHistory() {
  const container = document.getElementById('applicationHistoryList');
  if (!container) return;

  try {
    const list = JSON.parse(localStorage.getItem('famfex_applications') || '[]');
    if (list.length === 0) {
      container.innerHTML = '<p style="color: #64748b; font-size: 0.9rem;">No recent applications submitted from this device yet.</p>';
      return;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:0.75rem;">';
    list.forEach(item => {
      html += `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.9rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <strong style="color:#0f172a; font-size:0.95rem;">${item.role}</strong>
            <div style="font-size:0.8rem; color:#64748b;">Ref: <code style="background:#e2e8f0; padding:2px 5px; border-radius:4px;">${item.refCode}</code> | Submitted: ${item.date}</div>
          </div>
          <div>
            <span style="background:#dbeafe; color:#1e40af; font-size:0.78rem; font-weight:700; padding:4px 10px; border-radius:99px;">${item.status}</span>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}

// Function called by "Apply Now" buttons on job cards
function selectJobForApplication(jobTitle) {
  const selectElem = document.getElementById('appRole');
  const applySection = document.getElementById('applySection');
  if (selectElem) {
    selectElem.value = jobTitle;
  }
  if (applySection) {
    applySection.scrollIntoView({ behavior: 'smooth' });
  }
}
