# Deploying Dr Ajay Homeopathic Clinic to GitHub Pages

This site is plain static files (HTML, CSS, JS + images). No build step, no
framework. That means hosting is simple and free on **GitHub Pages**.

You'll do this inside **Claude Code in VS Code**, which runs on your computer and
uses *your* GitHub login — so it can create the repo, push the files, and turn on
Pages for you. You only have to sign in once.

---

## Before you start (one time)

1. **Open the project in VS Code.** Unzip `dr-ajay-clinic.zip` into a folder, then
   in VS Code choose *File → Open Folder…* and pick that folder.
   Make sure the 9 files (`index.html`, `about.html`, `services.html`,
   `contact.html`, `styles.css`, `script.js`, `favicon.svg`,
   `apple-touch-icon.png`, `og-image.png`) sit **directly** in the folder — not
   inside another sub-folder. `index.html` must be at the top level.

2. **Have these installed:**
   - Git — https://git-scm.com
   - GitHub CLI (`gh`) — https://cli.github.com  (this is what lets Claude Code
     create the repo and enable Pages automatically)
   - Claude Code — setup guide: https://docs.claude.com/en/docs/claude-code/overview

3. **Sign in to GitHub once**, in the VS Code terminal:
   ```bash
   gh auth login
   ```
   Follow the prompts (choose GitHub.com → HTTPS → login with a browser).
   This is the step only *you* can do. After it succeeds, Claude Code can do the rest.

---

## The easy path: let Claude Code do it

Open Claude Code in the project folder and paste the prompt below.

> **Paste this into Claude Code:**
>
> This folder is a finished static website for "Dr Ajay Homeopathic Clinic" —
> plain HTML/CSS/JS with `index.html` at the root. I want to deploy it to GitHub
> Pages. Please:
> 1. Confirm `gh auth status` is logged in (if not, stop and tell me to run `gh auth login`).
> 2. Initialise git here if needed, commit all files with a clear message.
> 3. Create a **public** GitHub repo named `dr-ajay-clinic` and push to it.
> 4. Enable GitHub Pages serving from the `main` branch, root folder (`/`).
> 5. Tell me the live URL (it will look like `https://<my-username>.github.io/dr-ajay-clinic/`).
> 6. Then find every occurrence of `REPLACE_WITH_YOUR_URL` in the `.html` files and
>    replace it with that live URL (no trailing slash), commit, and push again.
>    This activates the WhatsApp/social share preview image and the Google SEO data.
> 7. Confirm the page is live and the share tags now point to the real URL.

That's it. Give the Pages site a minute or two to go live after the first push.

---

## Manual path (if you'd rather run it yourself)

From the project folder in the VS Code terminal:

```bash
# 1. start git and make the first commit
git init
git add .
git commit -m "Initial site for Dr Ajay Homeopathic Clinic"

# 2. create a public repo and push (gh must be authenticated)
gh repo create dr-ajay-clinic --public --source=. --remote=origin --push

# 3. turn on GitHub Pages (main branch, root)
gh api --method POST -H "Accept: application/vnd.github+json" \
  /repos/{owner}/dr-ajay-clinic/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

Your live link will be:
```
https://<your-username>.github.io/dr-ajay-clinic/
```

### After it's live: set the real URL (important for share previews)
The share-card image and Google data currently use the placeholder
`REPLACE_WITH_YOUR_URL`. Replace it everywhere with your live link, then push again:

```bash
# macOS/Linux example — run once you know your URL
LIVE="https://<your-username>.github.io/dr-ajay-clinic"
grep -rl "REPLACE_WITH_YOUR_URL" . | xargs sed -i '' "s#REPLACE_WITH_YOUR_URL#$LIVE#g"   # macOS
# on Linux use:  xargs sed -i "s#REPLACE_WITH_YOUR_URL#$LIVE#g"

git commit -am "Set live site URL for share previews and SEO"
git push
```

Tip: test the WhatsApp/Facebook preview with
https://www.opengraph.xyz or by pasting the link into a WhatsApp chat to yourself.

---

## Notes

- **Free plan = public repo** for Pages. A public repo only means the *source
  files* are visible; there's nothing secret here. Private Pages needs GitHub Pro.
- **Custom domain later:** if you buy a domain (e.g. a `.in`), you can point it at
  this same Pages site — Settings → Pages → Custom domain. Ask and I'll walk you through it.
- **Updating the site:** change a file, then `git commit -am "..."` and `git push`.
  Pages redeploys automatically in a minute.

## Still to add (needs your material)
- Dr Ajay's **photo** (About page has a placeholder spot)
- His **qualification / registration number**
- Real **patient reviews**
- Confirm the email **dr.kuajay@gmail.com** is spelled correctly
- Optional: a **Hindi version** of the text

Bring those back to the main chat and I'll drop them in, then you just `git push` again.
