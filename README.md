
---

# NVD Frontend – React Application

A modern, responsive user interface for the NVD system, built with **React (Vite)** and **TypeScript**. This frontend provides a seamless experience for managing vaccination records, secured by JWT integration with the Spring Boot backend.

---

## 🚀 Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | React 18 (Vite) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS |
| **HTTP Client** | Axios |
| **Hosting** | AWS S3 (Static Website Hosting) |

---

## 🏗 System Architecture


<img width="2050" height="348" alt="mermaid-diagram-2026-03-03-141350" src="https://github.com/user-attachments/assets/517f1051-2655-4f38-829b-1490f95ffc3a" />


---

## 🌐 Live Deployment

The application is globally accessible via AWS S3 Static Hosting:

> **Production URL:** [http://www.nvd.live.s3-website.eu-north-1.amazonaws.com](http://www.nvd.live.s3-website.eu-north-1.amazonaws.com)

---

## 🔐 Authentication Flow

<img width="1586" height="922" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/4c046d78-e036-4c41-90e2-cf78ff04c0a0" />


---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory to point to your backend:

```env
VITE_API_BASE_URL=http://<YOUR_EC2_PUBLIC_IP>:8080/api

```

### Build Command

To generate the production-ready files:

```bash
npm run build

```

The output will be generated in the `dist/` folder.

---

## 📦 Deployment Process

To deploy manually to AWS S3:

1. **Build:** Run `npm run build` locally.
2. **Upload:** Upload the contents of the `dist/` folder to your S3 bucket.
3. **Permissions:** Ensure the S3 Bucket Policy allows `s3:GetObject` for public access.
4. **Static Hosting:** Set `index.html` as both the **Index** and **Error** document (essential for React Router SPAs).

---

## 🔄 GitHub Actions CI/CD (Optional)

You can automate deployment with this workflow logic:

* **Trigger:** Push to `main` branch.
* **Action:** 1. `npm install` && `npm run build`
2. `aws s3 sync dist/ s3://your-bucket-name --delete`

---

## 📂 Project Structure

```text
src/
 ├── components/  # Reusable UI elements (Buttons, Inputs, Navbar)
 ├── pages/       # Full page views (Login, Dashboard, Records)
 ├── services/    # Axios API configurations and calls
 ├── hooks/       # Custom React hooks (useAuth, useFetch)
 ├── utils/       # Helper functions and formatters
 └── App.tsx      # Main routing and provider setup

```

---

## 📌 Future Improvements

* [ ] **CloudFront:** Add a Content Delivery Network for faster global loading.
* [ ] **HTTPS:** Use AWS Certificate Manager (ACM) to secure the site.
* [ ] **State Management:** Integrate Redux Toolkit or TanStack Query for complex data states.
* [ ] **Unit Testing:** Add Vitest and React Testing Library for component stability.

---

