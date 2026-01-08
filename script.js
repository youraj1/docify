document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const toolsSection = document.getElementById('tools');
    const moreToolsSection = document.getElementById('more-tools');
    const contactSection = document.getElementById('contact-section');
    const aboutSection = document.getElementById('about-section');
    const menuIcon = mobileMenu ? mobileMenu.querySelector('i') : null;

    // Initially hide the more tools, contact, and about sections
    if (moreToolsSection) moreToolsSection.style.display = 'none';
    if (contactSection) contactSection.style.display = 'none';
    if (aboutSection) aboutSection.style.display = 'none';

    // Handle tab switching
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            
            navLinksItems.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            if (target === '#new' && toolsSection && moreToolsSection) {
                toolsSection.style.display = 'none';
                moreToolsSection.style.display = 'grid';
                if (contactSection) contactSection.style.display = 'none';
                if (aboutSection) aboutSection.style.display = 'none';
                moreToolsSection.scrollIntoView({ behavior: 'smooth' });
            } else if (target === '#home' && toolsSection && moreToolsSection) {
                toolsSection.style.display = 'grid';
                moreToolsSection.style.display = 'none';
                if (contactSection) contactSection.style.display = 'none';
                if (aboutSection) aboutSection.style.display = 'none';
                toolsSection.scrollIntoView({ behavior: 'smooth' });
            } else if (target === '#contact' && contactSection) {
                if (toolsSection) toolsSection.style.display = 'none';
                if (moreToolsSection) moreToolsSection.style.display = 'none';
                contactSection.style.display = 'flex';
                if (aboutSection) aboutSection.style.display = 'none';
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else if (target === '#about' && aboutSection) {
                if (toolsSection) toolsSection.style.display = 'none';
                if (moreToolsSection) moreToolsSection.style.display = 'none';
                if (contactSection) contactSection.style.display = 'none';
                aboutSection.style.display = 'flex';
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (navLinks) navLinks.classList.remove('active');
        });
    });

    // Toggle menu when clicking the button
    if (mobileMenu && navLinks && menuIcon) {
    mobileMenu.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && mobileMenu) {
        if (!navLinks.contains(event.target) && !mobileMenu.contains(event.target)) {
            navLinks.classList.remove('active');
                if (menuIcon) {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
                }
            }
        }
    });

    // Close menu when clicking a nav link
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    const modal = document.getElementById('tool-modal');
    const previewModal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    const previewDownloadBtn = document.getElementById('previewDownloadBtn');
    const previewTitle = document.getElementById('previewTitle');
    const previewFilenameInput = document.getElementById('previewFilename');
    const toolCards = document.querySelectorAll('.tool-card');
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const processBtn = document.getElementById('process-btn');
    const modalTitle = document.getElementById('modal-title');
    const protectOptions = document.getElementById('protect-options');
    const protectPassword = document.getElementById('protectPassword');
    const protectPasswordConfirm = document.getElementById('protectPasswordConfirm');
    const allowPrinting = document.getElementById('allowPrinting');
    const allowCopying = document.getElementById('allowCopying');
    
    let currentTool = '';
    let selectedFiles = [];
    let lastPreviewBlob = null;
    let lastPreviewUrl = null;

    // Toast helper
    function getToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    function showToast(message, type = 'info', durationMs = 3000) {
        const container = getToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';

        const text = document.createElement('div');
        text.className = 'toast-message';
        text.textContent = message;

        const close = document.createElement('button');
        close.className = 'toast-close';
        close.setAttribute('aria-label', 'Close notification');
        close.innerHTML = '&times;';
        close.addEventListener('click', () => removeToast());

        toast.appendChild(icon);
        toast.appendChild(text);
        toast.appendChild(close);
        container.appendChild(toast);

        let hideTimer = setTimeout(removeToast, durationMs);

        function removeToast() {
            clearTimeout(hideTimer);
            toast.style.animation = 'toastFadeOut 200ms ease forwards';
            setTimeout(() => {
                toast.remove();
                if (!container.children.length) container.remove();
            }, 180);
        }
    }

    // Open modal when clicking on a tool card
    if (modal && toolCards.length) {
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            currentTool = card.dataset.tool;
                if (modalTitle) modalTitle.textContent = card.querySelector('h3').textContent;
            modal.style.display = 'block';
            resetFileList();
            // Toggle protect options visibility
            if (protectOptions) {
                protectOptions.style.display = currentTool === 'protect' ? 'block' : 'none';
            }
        });
    });
    }

    // Wire all close buttons to close their parent modal
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', () => {
            const parentModal = btn.closest('.modal');
            if (parentModal) parentModal.style.display = 'none';
            if (parentModal && parentModal.id === 'tool-modal') resetFileList();
            if (parentModal && parentModal.id === 'previewModal') cleanupPreview();
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (modal && e.target === modal) {
            modal.style.display = 'none';
            resetFileList();
        }
        if (previewModal && e.target === previewModal) {
            previewModal.style.display = 'none';
            cleanupPreview();
        }
    });

    // Handle file selection through click
    if (uploadArea && fileInput) {
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    }

    // Handle file selection through drag and drop
    if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#357abd';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        handleFiles(e.dataTransfer.files);
    });
    }

    // Handle file input change
    if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    }

    // Process button click handler
    if (processBtn) {
    processBtn.addEventListener('click', () => {
        if (selectedFiles.length === 0) {
            alert('Please select at least one file');
            return;
        }
        processFiles();
    });
    }

    function handleFiles(files) {
        const incoming = Array.from(files);
        const isMerge = currentTool === 'merge';
        const isProtect = currentTool === 'protect';
        const validExtensions = (isMerge || isProtect) ? ['pdf'] : ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

        const validFiles = incoming.filter(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            return validExtensions.includes(extension);
        });

        if (validFiles.length === 0) {
            const msg = isMerge || isProtect ? 'Please select PDF files' : 'Please select valid files (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX)';
            showToast(msg, 'error');
            return;
        }

        selectedFiles = [...selectedFiles, ...validFiles];
        updateFileList();
    }

    function updateFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            const nameSpan = document.createElement('span');
            nameSpan.textContent = file.name;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => {
                removeFile(index);
            });

            fileItem.appendChild(nameSpan);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    }

    function resetFileList() {
        selectedFiles = [];
        if (fileList) fileList.innerHTML = '';
        if (fileInput) fileInput.value = '';
    }

    async function processFiles() {
        console.log(`Processing files for tool: ${currentTool}`);
        console.log('Selected files:', selectedFiles);

        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';

        try {
            if (currentTool === 'merge') {
                if (selectedFiles.length < 2) {
                    showToast('Select at least two PDF files to merge', 'error');
                    return;
                }
                const mergedBytes = await mergePdfFiles(selectedFiles);
                const blob = new Blob([mergedBytes], { type: 'application/pdf' });
                openPreview(blob, {
                    title: 'Preview Merged PDF',
                    suggestedName: `merged-${Date.now()}.pdf`
                });
                showToast('Preview generated. Review before downloading.', 'success', 3500);
            } else if (currentTool === 'protect') {
                if (selectedFiles.length !== 1) {
                    showToast('Select exactly one PDF to protect', 'error');
                    return;
                }
                const pwd = (protectPassword && protectPassword.value) ? protectPassword.value : '';
                const pwd2 = (protectPasswordConfirm && protectPasswordConfirm.value) ? protectPasswordConfirm.value : '';
                if (!pwd || !pwd2) {
                    showToast('Enter and confirm a password', 'error');
                    return;
                }
                if (pwd !== pwd2) {
                    showToast('Passwords do not match', 'error');
                    return;
                }
                const printingAllowed = !!(allowPrinting && allowPrinting.checked);
                const copyingAllowed = !!(allowCopying && allowCopying.checked);
                const protectedBytes = await protectPdfFile(selectedFiles[0], {
                    userPassword: pwd,
                    ownerPassword: pwd,
                    permissions: {
                        printing: printingAllowed ? 'highResolution' : 'none',
                        modifying: false,
                        copying: copyingAllowed,
                        annotating: false,
                        fillingForms: false,
                        contentAccessibility: false,
                        documentAssembly: false
                    }
                });
                const blob = new Blob([protectedBytes], { type: 'application/pdf' });
                openPreview(blob, {
                    title: 'Preview Protected PDF',
                    suggestedName: `protected-${Date.now()}.pdf`
                });
                showToast('Preview protected PDF. Click download to save.', 'success');
            } else {
                // Placeholder for other tools
                await new Promise(r => setTimeout(r, 1200));
                showToast('File processing completed! (This is a demo)', 'success', 3500);
            }
        } catch (err) {
            console.error(err);
            showToast('An error occurred while processing files', 'error', 4000);
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = 'Process Files';
            if (modal) modal.style.display = 'none';
            resetFileList();
        }
    }

    async function mergePdfFiles(files) {
        if (!window.PDFLib) throw new Error('PDF-LIB not loaded');
        const { PDFDocument } = window.PDFLib;
        const mergedPdf = await PDFDocument.create();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const srcDoc = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
            copiedPages.forEach(p => mergedPdf.addPage(p));
        }
        return await mergedPdf.save();
    }

    async function protectPdfFile(file, options) {
        if (!window.PDFLib) throw new Error('PDF-LIB not loaded');
        const { PDFDocument } = window.PDFLib;
        const bytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes);
        // pdf-lib v1.17+ supports encryption via save options; fall back if not available
        const saveOptions = {
            encrypt: {
                userPassword: options.userPassword,
                ownerPassword: options.ownerPassword,
                permissions: options.permissions
            }
        };
        try {
            // Some builds require passing options directly to save
            return await pdfDoc.save(saveOptions);
        } catch (e) {
            // Older versions use pdfDoc.encrypt + save
            if (typeof pdfDoc.encrypt === 'function') {
                pdfDoc.encrypt(options);
                return await pdfDoc.save();
            }
            throw e;
        }
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function openPreview(blob, opts = {}) {
        if (!previewModal || !previewFrame || !previewDownloadBtn) {
            // Fallback to direct download if preview UI is missing
            downloadBlob(blob, `merged-${Date.now()}.pdf`);
            return;
        }
        lastPreviewBlob = blob;
        if (lastPreviewUrl) URL.revokeObjectURL(lastPreviewUrl);
        lastPreviewUrl = URL.createObjectURL(blob);
        previewFrame.src = lastPreviewUrl;
        previewModal.style.display = 'flex';

        if (previewTitle) previewTitle.textContent = opts.title || 'Preview';
        if (previewFilenameInput) previewFilenameInput.value = opts.suggestedName || 'output.pdf';

        previewDownloadBtn.onclick = () => {
            const name = (previewFilenameInput && previewFilenameInput.value) ? previewFilenameInput.value : `output-${Date.now()}.pdf`;
            downloadBlob(lastPreviewBlob, name.endsWith('.pdf') ? name : `${name}.pdf`);
        };
    }

    function cleanupPreview() {
        if (previewFrame) previewFrame.src = '';
        if (lastPreviewUrl) {
            URL.revokeObjectURL(lastPreviewUrl);
            lastPreviewUrl = null;
        }
        lastPreviewBlob = null;
    }

    // Add some animation to tool cards
    if (toolCards.length) {
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    }

    // Auth modals
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeBtns = document.querySelectorAll('.modal .close');

    // Open login modal
    if (loginBtn && loginModal && signupModal) {
    loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        signupModal.style.display = 'none';
    });
    }

    // Open signup modal
    if (signupBtn && signupModal && loginModal) {
    signupBtn.addEventListener('click', () => {
            signupModal.style.display = 'flex';
        loginModal.style.display = 'none';
    });
    }

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (signupModal) signupModal.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (loginModal && e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (signupModal && e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Handle form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Login form submitted');
    });
    }

    if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Signup form submitted');
    });
    }

    // User Profile State Management
    let isUserSignedIn = false;
    let startY = 0;
    let currentY = 0;

    // Get user profile elements
    const profileBtn = document.querySelector('.profile-btn');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const signinBtn = document.querySelector('.signin-btn');
    const signoutBtn = document.querySelector('.signout-btn');
    const userInfo = document.querySelector('.profile-info');
    const socialButtons = document.querySelectorAll('.social-btn');
    const emailSigninBtn = document.querySelector('.email-signin-btn');

    // Function to update UI based on sign-in state
    function updateUIForUserState() {
        if (!profileBtn || !userInfo) return;
        if (isUserSignedIn) {
            profileBtn.innerHTML = '<i class="fas fa-user-circle"></i> <span>My Account</span>';
            if (signinBtn) signinBtn.style.display = 'none';
            if (signupBtn) signupBtn.style.display = 'none';
            if (signoutBtn) signoutBtn.style.display = 'flex';
            userInfo.innerHTML = `
                <span class="user-name">John Doe</span>
                <span class="user-email">john.doe@example.com</span>
            `;
        } else {
            profileBtn.innerHTML = '<i class="fas fa-user-circle"></i> <span>Sign In</span>';
            if (signinBtn) signinBtn.style.display = 'flex';
            if (signupBtn) signupBtn.style.display = 'flex';
            if (signoutBtn) signoutBtn.style.display = 'none';
            userInfo.innerHTML = `
                <span class="user-name">Guest User</span>
                <span class="user-email">Sign in to access your account</span>
            `;
        }
    }

    // Toggle dropdown
    if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            profileDropdown.classList.toggle('active');
            document.body.style.overflow = profileDropdown.classList.contains('active') ? 'hidden' : '';
        } else {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        }
    });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (profileDropdown && !e.target.closest('.user-profile')) {
            profileDropdown.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle touch events for swipe-to-close on mobile
    if (profileDropdown) {
    profileDropdown.addEventListener('touchstart', (e) => {
        if (window.innerWidth <= 768) {
            startY = e.touches[0].clientY;
        }
    });

    profileDropdown.addEventListener('touchmove', (e) => {
        if (window.innerWidth <= 768) {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
                if (diff > 0) {
                profileDropdown.style.transform = `translateY(${diff}px)`;
            }
        }
    });

    profileDropdown.addEventListener('touchend', () => {
        if (window.innerWidth <= 768) {
            const diff = currentY - startY;
            
                if (diff > 100) {
                profileDropdown.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            profileDropdown.style.transform = '';
        }
    });
    }

    // Handle sign in
    if (signinBtn) {
    signinBtn.addEventListener('click', () => {
            const lm = document.getElementById('loginModal');
            if (lm) lm.style.display = 'flex';
            if (profileDropdown) profileDropdown.style.display = 'none';
    });
    }

    // Handle sign out
    if (signoutBtn) {
    signoutBtn.addEventListener('click', () => {
        isUserSignedIn = false;
        updateUIForUserState();
            if (profileDropdown) profileDropdown.style.display = 'none';
    });
    }

    // Social Media Login Handlers
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = button.classList[1];
            
            console.log(`Attempting to authenticate with ${platform}`);
            
            setTimeout(() => {
                isUserSignedIn = true;
                updateUIForUserState();
                
                if (window.innerWidth <= 768) {
                    if (profileDropdown) {
                    profileDropdown.classList.remove('active');
                    document.body.style.overflow = '';
                    }
                } else if (profileDropdown) {
                    profileDropdown.style.display = 'none';
                }
                
                alert(`Successfully authenticated with ${platform}!`);
            }, 1000);
        });
    });

    // Update email signin handler
    if (emailSigninBtn) {
    emailSigninBtn.addEventListener('click', () => {
            const lm = document.getElementById('loginModal');
            if (lm) lm.style.display = 'flex';
        
        if (window.innerWidth <= 768) {
                if (profileDropdown) {
            profileDropdown.classList.remove('active');
            document.body.style.overflow = '';
                }
            } else if (profileDropdown) {
            profileDropdown.style.display = 'none';
        }
    });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            document.body.style.overflow = '';
            if (profileDropdown) profileDropdown.classList.remove('active');
        }
    });

    // Initialize UI state
    updateUIForUserState();

    // Mobile-specific handlers
    const profileBtnMobile = document.querySelector('.profile-btn');
    const profileDropdownMobile = document.querySelector('.profile-dropdown');

    // Toggle dropdown on mobile
    if (profileBtnMobile && profileDropdownMobile) {
    profileBtnMobile.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            profileDropdownMobile.classList.toggle('active');
            document.body.style.overflow = profileDropdownMobile.classList.contains('active') ? 'hidden' : '';
        }
    });
    }

    // Close dropdown when clicking the close button (mobile)
    if (profileDropdownMobile) {
    profileDropdownMobile.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (e.target === profileDropdownMobile || e.target.classList.contains('profile-dropdown')) {
                profileDropdownMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    }

    // Handle swipe down to close on mobile
    let touchStartY = 0;
    let touchEndY = 0;

    if (profileDropdownMobile) {
    profileDropdownMobile.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    profileDropdownMobile.addEventListener('touchmove', (e) => {
        touchEndY = e.touches[0].clientY;
    });

    profileDropdownMobile.addEventListener('touchend', () => {
        const swipeDistance = touchEndY - touchStartY;
            if (swipeDistance > 100) {
            profileDropdownMobile.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    }

    // Prevent body scroll when dropdown is open on mobile
    function toggleBodyScroll(disable) {
        if (window.innerWidth <= 768) {
            document.body.style.overflow = disable ? 'hidden' : '';
        }
    }

    // Update social button handlers for mobile
    socialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = button.classList[1];
            
            console.log(`Attempting to authenticate with ${platform}`);
            
            setTimeout(() => {
                isUserSignedIn = true;
                updateUIForUserState();
                
                if (window.innerWidth <= 768) {
                    if (profileDropdownMobile) {
                    profileDropdownMobile.classList.remove('active');
                    toggleBodyScroll(false);
                    }
                } else if (profileDropdownMobile) {
                    profileDropdownMobile.style.display = 'none';
                }
                
                alert(`Successfully authenticated with ${platform}!`);
            }, 1000);
        });
    });

    // Update email signin handler for mobile
    if (emailSigninBtn) {
    emailSigninBtn.addEventListener('click', () => {
            const lm = document.getElementById('loginModal');
            if (lm) lm.style.display = 'flex';
        
        if (window.innerWidth <= 768) {
                if (profileDropdownMobile) {
            profileDropdownMobile.classList.remove('active');
            toggleBodyScroll(false);
                }
            } else if (profileDropdownMobile) {
            profileDropdownMobile.style.display = 'none';
        }
    });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            toggleBodyScroll(false);
            if (profileDropdownMobile) profileDropdownMobile.classList.remove('active');
        }
    });

    // Handle More dropdown on mobile
    const moreDropdown = document.querySelector('.nav-dropdown');
    const moreLink = moreDropdown ? moreDropdown.querySelector('.nav-link') : null;

    if (moreDropdown && moreLink) {
    moreLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            moreDropdown.classList.toggle('active');
        }
    });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (moreDropdown && !e.target.closest('.nav-dropdown')) {
            moreDropdown.classList.remove('active');
        }
    });

    // Handle brand name animation
    const brandName = document.querySelector('.brand-name');
    if (brandName) {
    if (!sessionStorage.getItem('brandAnimationPlayed')) {
        brandName.style.animation = 'gradientText 2s ease forwards';
        sessionStorage.setItem('brandAnimationPlayed', 'true');
    } else {
        brandName.classList.add('animated');
        }
    }
}); 