# Portfolio Website — Setup Guide (Hinglish)

## 1. Apni Images Daalo
`assets` folder mein ye files daalo (exact naam yehi rakhna, ya `index.html` mein path change kar dena):
- `logo.png` — chhota logo, navbar ke liye (round dikhega)
- `favicon.png` — browser tab icon
- `profile.jpg` — apni photo, hero section ke liye
- `project1.jpg`, `project2.jpg`, `project3.jpg`, `project4.jpg` — project thumbnails
- `testimonial1.jpg` — client ki photo (optional)

Agar koi image nahi daalte ho, page tab bhi kaam karega — bas placeholder text dikhega uss jagah, error nahi aayega.

## 2. Apna Content Edit Karo
- **Naam, taglines, bio, contact info** → `index.html` mein direct edit karo (Ctrl+F se dhundo)
- **Projects, tech stack, FAQ chatbot ke jawab** → `data.js` file khol ke edit karo (yahan koi coding logic nahi hai, bas data hai)

## 3. Contact Form Live Karo (Free)
Abhi form UI kaam karta hai but actually email nahi bhejta. Isko live karne ke liye:
1. Free account banao [emailjs.com](https://www.emailjs.com) pe
2. Apna email service connect karo aur ek template banao
3. `index.html` ke `</body>` se pehle ye line add karo:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
4. `script.js` mein jo lines comment kiye hain (`// emailjs.sendForm...`) unko uncomment karo aur apne Service ID, Template ID, Public Key daal do

## 4. Free Hosting (koi bhi ek choose karo)

**Option A — Netlify (sabse aasan)**
1. [netlify.com](https://netlify.com) pe free account banao
2. Poora `portfolio` folder drag-and-drop karo unke dashboard pe
3. Turant live link mil jayega (`yourname.netlify.app`)

**Option B — Vercel**
1. [vercel.com](https://vercel.com) pe account banao
2. "Add New Project" → folder upload karo
3. Deploy — live link mil jayega (`yourname.vercel.app`)

**Option C — GitHub Pages**
1. GitHub pe naya repo banao, saari files upload karo
2. Repo Settings → Pages → branch select karo → Save
3. Live link milega (`yourusername.github.io/reponame`)

## 5. AI Chatbot Widget
Bottom-right corner mein 💬 button hai — ye rule-based FAQ assistant hai (koi API cost nahi). Iske jawab `data.js` ke `FAQ` array mein edit kar sakte ho. Jab traffic aur budget dono ho, iske jagah real AI API (Claude) laga sakte ho.

## Files Kya Hain
- `index.html` — poori website ka structure
- `style.css` — saara design/styling
- `data.js` — projects, tech stack, FAQ — **yahi sabse zyada edit karoge**
- `script.js` — functionality (filtering, chat, form) — inko chhedo mat jab tak zaroorat na ho
- `assets/` — apni images yahan daalo
