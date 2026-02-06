import { motion } from "framer-motion";

export default function Rules() {
    const rules = [
        {
            title: "Dress Code",
            description: "Strictly adhere to the event theme. No casuals. Failure to comply leads to denied entry.",
        },
        {
            title: "Respect",
            description: "Any form of harassment or disrespect towards guests or staff will result in immediate removal.",
        },
        {
            title: "Zero Tolerance",
            description: "Possession of illegal substances or weapons is prohibited. Security checks are mandatory.",
        },
        {
            title: "Privacy",
            description: "What happens in Velvyt, stays in Velvyt. Respect the privacy of high-profile guests.",
        },
        {
            title: "Rights of Admission",
            description: "The management reserves the right of admission at all times."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto"
        >
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">House Rules</h1>
                <p className="text-xs font-mono text-white/40 tracking-widest uppercase">
                    Read Carefully Before Registering
                </p>
            </motion.header>

            <div className="space-y-8">
                {rules.map((rule, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border-l-2 border-white/10 pl-6 hover:border-white/50 transition-colors"
                    >
                        <h2 className="text-xl font-bold font-display uppercase tracking-wider mb-2 text-white/90">
                            {String(index + 1).padStart(2, '0')}. {rule.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {rule.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
