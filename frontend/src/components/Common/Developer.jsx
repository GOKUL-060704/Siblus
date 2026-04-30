import React from 'react';
import gokulImage from '../../assets/gokul.jpeg';
import {
    FiCalendar,
    FiCode,
    FiCpu,
    FiDatabase,
    FiGlobe,
    FiLayers,
    FiLayout,
    FiMail,
    FiPhone,
    FiServer,
    FiTerminal,
} from 'react-icons/fi';

export default function Developer() {
    const skills = [
        { name: 'React', icon: <FiCode className="w-6 h-6" />, color: 'text-blue-400' },
        { name: 'Next.js', icon: <FiLayers className="w-6 h-6" />, color: 'text-slate-200' },
        { name: 'Frontend Tech', icon: <FiGlobe className="w-6 h-6" />, color: 'text-pink-500' },
        { name: 'Backend Tech', icon: <FiLayout className="w-6 h-6" />, color: 'text-indigo-400' },
        { name: 'Node.js', icon: <FiServer className="w-6 h-6" />, color: 'text-green-500' },
        { name: 'Python for AI', icon: <FiTerminal className="w-6 h-6" />, color: 'text-yellow-400' },
        { name: 'Database Tech', icon: <FiDatabase className="w-6 h-6" />, color: 'text-orange-400' },
    ];

    const services = [
        {
            title: 'AI Development',
            description: 'Developing cutting-edge AI-related projects tailored to specific needs and integrations.',
            icon: <FiCpu className="w-8 h-8 text-secondary" />,
        },
        {
            title: 'Web Development',
            description: 'Building highly responsive static and dynamic websites with modern front-end and back-end technologies.',
            icon: <FiGlobe className="w-8 h-8 text-secondary" />,
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
                        Meet the Developer
                    </h1>
                    <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Passionate about building scalable web applications, dynamic experiences, and innovative AI solutions.
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* Left Column: Image */}
                        <div className="relative h-full min-h-[400px] md:min-h-full bg-gray-900 overflow-hidden">
                            <img
                                src={gokulImage}
                                alt="Gokul - Software Engineer"
                                className="absolute inset-0 w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                            <div className="absolute bottom-8 left-8 text-white">
                                <h2 className="text-4xl font-heading font-bold mb-2">Gokul</h2>
                                <div className="flex items-center gap-2 text-secondary font-semibold text-xl">
                                    <FiCode className="w-6 h-6" />
                                    Software Engineer
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
                            <div className="flex flex-wrap gap-3 mb-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm shadow-sm border border-primary/20">
                                    <FiCalendar className="w-4 h-4" />
                                    1+ Years Experience
                                </div>
                                <a href="mailto:gokul060704@gmail.com" className="inline-flex items-center text-primary gap-2 px-4 py-2 bg-gray-100 bg-primary/10 transition-colors rounded-full font-bold text-sm shadow-sm border border-gray-200">
                                    <FiMail className="w-4 h-4" />
                                    gokul060704@gmail.com
                                </a>
                                <a href="tel:9363255885" className="bg-primary/10 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-primary transition-colors rounded-full font-bold text-sm shadow-sm border border-gray-200">
                                    <FiPhone className="w-4 h-4" />
                                    +91 93632 55885
                                </a>
                            </div>

                            {/* Skills */}
                            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-5 flex items-center gap-2">
                                Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-3 mb-10">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index} 
                                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl shadow-md border border-gray-700"
                                    >
                                        <span className={skill.color}>{skill.icon}</span>
                                        <span className="font-semibold text-sm">{skill.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Services */}
                            <h3 className="text-2xl font-heading font-bold text-gray-900 mb-5 relative inline-block">
                                What I Do
                            </h3>
                            <div className="space-y-4">
                                {services.map((service, index) => (
                                    <div key={index} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:shadow-lg hover:border-secondary/30 transition-all bg-gray-100 group">
                                        <div className="shrink-0 bg-white p-3 rounded-xl shadow-sm group-hover:text-white transition-colors duration-300">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{service.title}</h4>
                                            <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button - optional, standard feature for developer profile */}
                            {/* <div className="mt-10 pt-8 border-t border-gray-100">
                <a href="#contact" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold hover:bg-primary-dark transition-all transform hover:scale-[1.02] shadow-md w-full justify-center text-lg">
                  <Mail className="w-5 h-5" />
                  Get In Touch
                </a>
              </div> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
