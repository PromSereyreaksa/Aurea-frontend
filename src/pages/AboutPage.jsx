import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Linkedin,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Navbar from "../components/Shared/Navbar";
import Footer from "../components/Shared/Footer";

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
    icon: <TrendingUp size={32} />,
  },
  {
    title: "Support fair pricing for designers",
    description:
      "We believe designers deserve to be compensated fairly for their creative work and expertise in the market.",
    icon: <DollarSign size={32} />,
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
    name: "Huy Visa",
    role: "Backend Developer",
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
    role: "Backend Developer",
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
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-wider uppercase text-black leading-none"
          >
            About AUREA
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-xl md:text-2xl font-medium text-black max-w-lg mx-auto"
          >
            Helping designers showcase their brilliance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="pt-8"
          >
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We are AUREA, an all-in-one launchpad for emerging designers. Our
              mission is to help designers confidently build their identity,
              present their work professionally, and succeed in the global
              creative market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-8 tracking-wide">
                Our Story
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
            </div>
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-black h-96 w-full flex items-center justify-center"
              >
                <span className="text-white text-6xl font-bold tracking-wider">
                  AUREA
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group cursor-pointer"
              >
                <div className="relative mb-8">
                  <motion.div
                    whileHover={{
                      scale: 1.1,
                      transition: { duration: 0.3 },
                    }}
                    className="w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300 rounded-lg"
                  >
                    {value.icon}
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 tracking-wide group-hover:text-orange-600 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 tracking-wide">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind AUREA
            </p>
          </div>

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
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-cover mx-auto rounded-full mb-4 transition-all duration-300"
                  />
                </motion.div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-black mb-2 tracking-wide">
                    {member.name}
                  </h3>
                  <p className="text-lg font-medium text-[#fb8500] mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {member.description}
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
                            className="p-2 bg-gray-100 hover:bg-[#fb8500] text-gray-600 hover:text-white rounded-full transition-all duration-300 transform hover:scale-110"
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

      {/* Mission Section */}
      <section id="mission" className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-wide">
              Our Mission
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed mb-8">
              To empower every designer with tools that amplify their
              creativity, streamline their workflow, and help them build
              successful creative businesses.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="inline-block border-2 border-white px-8 py-4"
            >
              <span className="text-lg font-medium tracking-wide">
                JOIN US ON THIS JOURNEY
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
