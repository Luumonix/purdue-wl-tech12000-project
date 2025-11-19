"""
Seed data for cybersecurity questions based on the design journal research
Categories: phishing, passwords, wifi, mfa, general
"""

QUESTIONS = [
    # Phishing Questions
    {
        "question_text": "You receive an email claiming to be from Purdue IT asking you to verify your BoilerKey credentials by clicking a link. What should you do?",
        "options": [
            "Click the link and enter your credentials to verify",
            "Reply to the email asking if it's legitimate",
            "Delete the email and report it as phishing",
            "Forward it to your friends to warn them"
        ],
        "correct_answer": "Delete the email and report it as phishing",
        "explanation": "Purdue IT will never ask you to verify credentials via email. This is a classic phishing attempt. Always report suspicious emails and never click unknown links.",
        "category": "phishing",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "An email appears to be from your professor with an attachment labeled 'Final_Exam_Answers.pdf'. The sender's email looks slightly off. What's the safest action?",
        "options": [
            "Open the attachment to see if it's real",
            "Contact your professor through official channels to verify",
            "Download it but don't open it yet",
            "Reply asking if they sent it"
        ],
        "correct_answer": "Contact your professor through official channels to verify",
        "explanation": "Attackers often impersonate authority figures. Always verify suspicious emails through official channels (like Brightspace or their official Purdue email) before opening attachments.",
        "category": "phishing",
        "difficulty": "medium",
        "points_value": 15
    },
    {
        "question_text": "Which of these is the BEST indicator that an email might be a phishing attempt?",
        "options": [
            "It has spelling errors",
            "It creates urgency and threatens account closure",
            "It comes from an unknown sender",
            "All of the above"
        ],
        "correct_answer": "All of the above",
        "explanation": "Phishing emails often combine multiple red flags: urgency/threats, poor grammar, and suspicious senders. Being aware of all these indicators helps you stay safe.",
        "category": "phishing",
        "difficulty": "easy",
        "points_value": 10
    },
    
    # Password Questions
    {
        "question_text": "You're creating a new password for your banking app. Which is the MOST secure option?",
        "options": [
            "Purdue2024!",
            "MyDog'sName123",
            "Tr0ub4dor&3",
            "correct-horse-battery-staple-2024"
        ],
        "correct_answer": "correct-horse-battery-staple-2024",
        "explanation": "Longer passphrases with random words are more secure than shorter complex passwords. Length matters more than complexity. This password is both long and memorable.",
        "category": "passwords",
        "difficulty": "medium",
        "points_value": 15
    },
    {
        "question_text": "How many different passwords should you use across all your accounts?",
        "options": [
            "One strong password for everything",
            "Two passwords: one for important accounts, one for others",
            "A unique password for every account",
            "Three passwords rotated monthly"
        ],
        "correct_answer": "A unique password for every account",
        "explanation": "Using unique passwords prevents a breach on one site from compromising all your accounts. Use a password manager to keep track of them all.",
        "category": "passwords",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "Your friend asks to borrow your laptop to check their email quickly. What's the safest approach?",
        "options": [
            "Let them use it while you watch",
            "Log them into a guest account",
            "Give them your password so they can log in themselves",
            "Tell them to use their phone instead"
        ],
        "correct_answer": "Log them into a guest account",
        "explanation": "Guest accounts prevent access to your personal files and saved passwords. Never share your password, even with friends you trust.",
        "category": "passwords",
        "difficulty": "medium",
        "points_value": 15
    },
    
    # Public WiFi Questions
    {
        "question_text": "You're at a coffee shop and see two WiFi networks: 'Starbucks-Guest' and 'Starbucks_Free_WiFi'. Which should you choose?",
        "options": [
            "Starbucks_Free_WiFi because it's free",
            "Starbucks-Guest because it looks official",
            "Ask the staff which is the legitimate network",
            "Use your mobile hotspot instead"
        ],
        "correct_answer": "Ask the staff which is the legitimate network",
        "explanation": "Attackers create fake WiFi networks with convincing names (evil twin attacks). Always verify the official network name with staff before connecting.",
        "category": "wifi",
        "difficulty": "medium",
        "points_value": 15
    },
    {
        "question_text": "You're connected to PAL 3.0 (Purdue's secure network) in the library. Is it safe to check your bank account?",
        "options": [
            "Yes, PAL 3.0 is encrypted and secure",
            "No, never use public networks for banking",
            "Only if you use a VPN",
            "Yes, but only if the website uses HTTPS"
        ],
        "correct_answer": "Yes, PAL 3.0 is encrypted and secure",
        "explanation": "PAL 3.0 uses WPA2/WPA3 encryption and requires authentication, making it secure for sensitive activities. However, always verify you're on the real PAL 3.0 network.",
        "category": "wifi",
        "difficulty": "hard",
        "points_value": 20
    },
    {
        "question_text": "What's the main risk of using public WiFi at airports or cafes?",
        "options": [
            "Slower internet speeds",
            "Man-in-the-middle attacks where hackers intercept your data",
            "Your device battery drains faster",
            "You might get charged for usage"
        ],
        "correct_answer": "Man-in-the-middle attacks where hackers intercept your data",
        "explanation": "On unsecured public WiFi, attackers can position themselves between you and the network, intercepting passwords, emails, and other sensitive data.",
        "category": "wifi",
        "difficulty": "easy",
        "points_value": 10
    },
    
    # Multi-Factor Authentication Questions
    {
        "question_text": "What is the main benefit of enabling Multi-Factor Authentication (MFA)?",
        "options": [
            "It makes logging in faster",
            "It protects your account even if your password is stolen",
            "It eliminates the need for a strong password",
            "It prevents phishing emails"
        ],
        "correct_answer": "It protects your account even if your password is stolen",
        "explanation": "MFA adds an extra layer of security. Even if someone steals your password, they can't access your account without the second factor (like your phone).",
        "category": "mfa",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "Which MFA method is considered MOST secure?",
        "options": [
            "SMS text message codes",
            "Email verification codes",
            "Authenticator app (like Duo Mobile)",
            "Security questions"
        ],
        "correct_answer": "Authenticator app (like Duo Mobile)",
        "explanation": "Authenticator apps are more secure than SMS (which can be intercepted) or email. They generate time-based codes that work even offline.",
        "category": "mfa",
        "difficulty": "medium",
        "points_value": 15
    },
    {
        "question_text": "You receive a Duo push notification but you didn't try to log in. What should you do?",
        "options": [
            "Approve it - it's probably a mistake",
            "Deny it and immediately change your password",
            "Ignore it",
            "Approve it and then change your password"
        ],
        "correct_answer": "Deny it and immediately change your password",
        "explanation": "An unexpected MFA request means someone has your password and is trying to access your account. Deny it and change your password immediately.",
        "category": "mfa",
        "difficulty": "medium",
        "points_value": 15
    },
    
    # General Cybersecurity Questions
    {
        "question_text": "You're working on a group project in the WALC. You need to use the restroom. What should you do with your laptop?",
        "options": [
            "Leave it open - you'll only be gone a minute",
            "Lock the screen (Windows+L or Ctrl+Cmd+Q)",
            "Close the lid but don't lock it",
            "Ask a stranger to watch it"
        ],
        "correct_answer": "Lock the screen (Windows+L or Ctrl+Cmd+Q)",
        "explanation": "Always lock your screen when stepping away, even briefly. Our observations showed 40% of students leave laptops unattended - this is a major security risk.",
        "category": "general",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "A website asks you to disable your antivirus to download a 'required' file for class. What should you do?",
        "options": [
            "Disable it temporarily to get the file",
            "Don't download the file and report it to your professor",
            "Download it but scan it first",
            "Ask your classmates if they did it"
        ],
        "correct_answer": "Don't download the file and report it to your professor",
        "explanation": "Legitimate software never requires disabling antivirus. This is a major red flag for malware. Always report suspicious requirements to your instructor.",
        "category": "general",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "What does HTTPS in a website URL indicate?",
        "options": [
            "The website is safe from all threats",
            "The connection between you and the website is encrypted",
            "The website is verified by Purdue",
            "The website loads faster"
        ],
        "correct_answer": "The connection between you and the website is encrypted",
        "explanation": "HTTPS encrypts data between you and the website, protecting it from interception. However, it doesn't guarantee the site itself is trustworthy - phishing sites can also use HTTPS.",
        "category": "general",
        "difficulty": "medium",
        "points_value": 15
    },
    {
        "question_text": "You find a USB drive in the parking lot. What should you do?",
        "options": [
            "Plug it into your computer to see who it belongs to",
            "Turn it in to lost and found without plugging it in",
            "Keep it - finders keepers",
            "Plug it into a library computer to check the contents"
        ],
        "correct_answer": "Turn it in to lost and found without plugging it in",
        "explanation": "Unknown USB drives can contain malware that automatically installs when plugged in. This is a common attack vector. Never plug in unknown devices.",
        "category": "general",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "How often should you update your software and operating system?",
        "options": [
            "Only when you have time",
            "Once a year",
            "As soon as updates are available",
            "Never - updates cause problems"
        ],
        "correct_answer": "As soon as updates are available",
        "explanation": "Updates often contain critical security patches. Delaying updates leaves your system vulnerable to known exploits that attackers actively target.",
        "category": "general",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "Someone on social media claims they can get you free Purdue dining dollars if you give them your login. What should you do?",
        "options": [
            "Give them your login - free food!",
            "Create a temporary password to give them",
            "Report them for attempting to steal credentials",
            "Ask them to prove it first"
        ],
        "correct_answer": "Report them for attempting to steal credentials",
        "explanation": "This is social engineering - manipulating people into giving up sensitive information. Never share credentials, no matter what someone promises. Report these scams immediately.",
        "category": "general",
        "difficulty": "easy",
        "points_value": 10
    },
    {
        "question_text": "What's the safest way to share sensitive files with your project group?",
        "options": [
            "Email them as attachments",
            "Upload to Google Drive with link sharing set to 'anyone with link'",
            "Use Purdue's OneDrive with specific person permissions",
            "Post them in a private Discord server"
        ],
        "correct_answer": "Use Purdue's OneDrive with specific person permissions",
        "explanation": "Purdue's OneDrive is encrypted and allows you to control exactly who can access files. 'Anyone with link' sharing can expose files if the link is leaked.",
        "category": "general",
        "difficulty": "medium",
        "points_value": 15
    },
    {
        "question_text": "You're using a public computer in the library. What should you do before leaving?",
        "options": [
            "Just close the browser",
            "Log out of all accounts and clear browser history",
            "Shut down the computer",
            "Delete your browsing history only"
        ],
        "correct_answer": "Log out of all accounts and clear browser history",
        "explanation": "Public computers may save your login sessions and browsing data. Always log out completely and clear your history to prevent the next user from accessing your accounts.",
        "category": "general",
        "difficulty": "easy",
        "points_value": 10
    }
]
