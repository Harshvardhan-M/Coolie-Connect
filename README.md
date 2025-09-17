# Coolie On Demand Service 🚚

A modern, full-stack on-demand service platform built with React, TypeScript, and Tailwind CSS. Connect service providers with customers for seamless booking and delivery experiences.

## 🌟 Features

- **User Authentication** - Secure login/signup for customers and service providers
- **Real-time Booking** - Instant service requests and provider matching
- **Payment Integration** - Secure payment processing with multiple options
- **Live Tracking** - Real-time location tracking for services
- **Rating System** - Customer feedback and provider ratings
- **Multi-language Support** - Localized experience for global users
- **Mobile Responsive** - Optimized for all devices
- **Admin Dashboard** - Comprehensive management panel

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Supabase** - Backend-as-a-Service (Database, Auth, Storage)
- **Vercel** - Deployment and hosting platform
- **Stripe** - Payment processing
- **Google Maps API** - Location services and mapping

### Development Tools
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Git** - Version control

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase account** (for backend services)
- **Stripe account** (for payments)
- **Google Maps API key** (for location services)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/coolie-on-demand-service.git
   cd coolie-on-demand-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`


## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | ✅ |

## 📱 Features Overview

### For Customers
- Browse available services
- Book services instantly
- Track service provider location
- Make secure payments
- Rate and review services
- View booking history

### For Service Providers
- Register and verify profile
- Receive booking notifications
- Update availability status
- Navigate to customer location
- Manage earnings and payouts
- View performance analytics

### For Administrators
- Manage users and providers
- Monitor platform analytics
- Handle disputes and support
- Configure platform settings
- Generate reports

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

- 📧 Email: support@coolieservice.com
- 💬 Discord: [Join our community](https://discord.gg/coolieservice)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/coolie-on-demand-service/issues)

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for seamless deployment
- [Lucide](https://lucide.dev/) for beautiful icons

## 🗺️ Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace
- [ ] AI-powered service matching
- [ ] Voice booking integration
- [ ] Blockchain-based payments
- [ ] IoT device integration

---

**Made with ❤️ by the Coolie Service Team**

⭐ Star this repository if you find it helpful!
