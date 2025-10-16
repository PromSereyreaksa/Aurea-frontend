import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Linkedin,
  TrendingUp,
  DollarSign,
  Sparkles,
} from "lucide-react";
import ModernNavbar from "../components/LandingPage/ModernNavbar";
import ModernFooter from "../components/LandingPage/ModernFooter";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const values = [
  {
    title: "Prioritize designer growth",
    description:
      "We are committed to helping designers develop their skills, expand their portfolios, and advance their creative careers.",
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    title: "Support fair pricing for designers",
    description:
      "We believe designers deserve to be compensated fairly for their creative work and expertise in the market.",
    icon: <DollarSign className="w-8 h-8" />,
  },
];

const teamMembers = [
  {
    name: "Kao Sodavann",
    role: "Founder",
    image: "/Sodavann.jpg",
    description:
      "Visionary leader focused on bridging creativity and technology to empower digital artists.",
    contacts: [
      { platform: "email", url: "mailto:kaosodavann714@gmail.com" },
      { platform: "telegram", url: "https://t.me/vannnnn001" },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/kao-sodavann-b4b173321/",
      },
    ],
  },
  {
    name: "Prom Sereyreaksa",
    role: "Co-Founder",
    image: "/Sereyreaksa.jpg",
    description:
      "Creative technologist passionate about intuitive user experience and platform innovation.",
    contacts: [
      { platform: "email", url: "mailto:prumsereyreaksa@gmail.com" },
      { platform: "telegram", url: "https://t.me/souuJ" },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/prom-sereyreaksa-2a2298364/",
      },
    ],
  },
  {
    name: "Chea Ilong",
    role: "Backend Developer",
    image: "/Ilong.jpg",
    description:
      "Specializes in backend architecture, security, and efficient API development.",
    contacts: [
      { platform: "email", url: "mailto:cheadara133@gmail.com" },
      { platform: "telegram", url: "http://t.me/Chea_Ilong" },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/chea-ilong-88bb83333",
      },
    ],
  },
  {
    name: "Kosal Sophanith",
    role: "Frontend Developer",
    image: "/Sophanith.jpg",
    description:
      "Frontend engineer with an eye for detail and commitment to excellent UX.",
    contacts: [
      { platform: "email", url: "mailto:sophanithkosal9@gmail.com" },
      { platform: "telegram", url: "https://t.me/nithkidd" },
      { platform: "linkedin", url: "" },
    ],
  },
  {
    name: "Huy Visa",
    role: "Business Analyst",
    image: "/Visa.jpg",
    description:
      "Focused on scalable backend systems and reliable data operations.",
    contacts: [
      { platform: "email", url: "mailto:Visadekh@gmail.com" },
      { platform: "telegram", url: "https://t.me/visahuy" },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/huy-visa-8443b2308",
      },
    ],
  },
  {
    name: "Chheang Sovanpanha",
    role: "Business Analyst",
    image: "/Sovanpanha.jpg",
    description:
      "Builds robust server-side logic and contributes to seamless data integration.",
    contacts: [
      { platform: "email", url: "mailto:Panhasovan51@gmail.com" },
      { platform: "telegram", url: "https://t.me/nhaaZzz" },
      {
        platform: "linkedin",
        url: "https://www.linkedin.com/in/sovanpanha-chheang-17473b32a/",
      },
    ],
  },
];

const getContactIcon = (platform) => {
  switch (platform) {
    case "email":
      return <Mail size={18} />;
    case "telegram":
      return <MessageCircle size={18} />;
    case "linkedin":
      return <Linkedin size={18} />;
    default:
      return null;
  }
};

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-page min-h-screen bg-white text-black">
      <ModernNavbar />

      {/* Hero Section - Modern Style */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/20 to-white pointer-events-none" />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#fb8500]" />
            <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
              About AUREA
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] mb-6 leading-tight"
          >
            Empowering designers
            <br />
            <span className="text-[#fb8500]">to showcase brilliance</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            We are AUREA, an all-in-one launchpad for emerging designers. Our
            mission is to help designers confidently build their identity,
            present their work professionally, and succeed in the global
            creative market.
          </motion.p>
        </div>
      </section>

      {/* Story Section - Modern Style */}
      <section id="story" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6">
                <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
                  Our Story
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-8">
                Building tools that
                <br />
                <span className="text-[#fb8500]">designers deserve</span>
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  AUREA was born from a simple observation: talented designers
                  were struggling to showcase their work effectively. Despite
                  creating beautiful designs, many found it challenging to
                  present their portfolios, pitch to clients, and price their
                  services confidently.
                </p>
                <p>
                  We set out to change that. Our mission is to provide designers
                  with professional-grade tools that are as beautiful and
                  intuitive as the work they create. Every feature is crafted
                  with the designer's workflow in mind.
                </p>
                <p>
                  Today, AUREA helps thousands of designers worldwide present
                  their work with confidence, win more clients, and build
                  successful creative businesses.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#fb8500] to-[#ff9500] h-96 w-full flex items-center justify-center rounded-2xl shadow-xl">
                <span className="text-white text-6xl md:text-7xl font-bold tracking-wider">
                  AUREA
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Modern Style */}
      <section
        id="values"
        className="py-24 px-6 bg-gradient-to-b from-white to-orange-50/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6"
            >
              <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
                Our Values
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
            >
              Principles that
              <br />
              <span className="text-[#fb8500]">guide everything we build</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#fb8500] hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-6 text-[#fb8500]">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Tree Structure */}
      <section id="team" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6"
            >
              <span className="text-sm font-semibold text-[#fb8500] tracking-wide uppercase">
                Our Team
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6"
            >
              Meet our team
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              The passionate people behind AUREA
            </motion.p>
          </div>

          {/* Team Grid - Original Design */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#fb8500] hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover mx-auto rounded-full border-2 border-gray-200"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-lg font-semibold text-[#fb8500] mb-4">
                    {member.role}
                  </p>

                  {/* Contact Links */}
                  <div className="flex justify-center space-x-3">
                    {member.contacts.map(
                      (contact, contactIndex) =>
                        contact.url && (
                          <a
                            key={contactIndex}
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 hover:bg-[#fb8500] text-gray-600 hover:text-white rounded-full transition-all duration-300"
                          >
                            {getContactIcon(contact.platform)}
                          </a>
                        )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section - Modern Style */}
      <section
        id="mission"
        className="py-24 px-6 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#2a2a2a] text-white relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#fb8500] rounded-full filter blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff9500] rounded-full filter blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-[#fb8500]" />
              <span className="text-sm font-semibold text-white tracking-wide uppercase">
                Our Mission
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Empowering designers
              <br />
              <span className="text-[#fb8500]">
                to build successful businesses
              </span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-12 text-gray-300 max-w-3xl mx-auto">
              To provide every designer with tools that amplify their
              creativity, streamline their workflow, and help them build
              successful creative businesses.
            </p>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="inline-block px-8 py-4 bg-[#fb8500] text-white font-semibold rounded-lg hover:bg-[#ff9500] transition-all duration-300 shadow-lg"
            >
              JOIN US ON THIS JOURNEY
            </motion.a>
          </motion.div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
};

export default AboutPage;
