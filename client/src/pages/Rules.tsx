import { motion } from "framer-motion";

export default function Rules() {
    const rules = [
        {
            title: "Zero Drama",
            description: "Zero harassment, or you will get harassed back.",
        },
        {
            title: "Hands. to. Yourself.",
            description: "Thrashing will not be tolerated, and will result in penalisation",
        },
        {
            title: "Clocks Exist",
            description: "Arrive on time, or within the designated window. Do not show up early or late.",
        },
        {
            title: "Don't Be That Person",
            description: "Do not start arguments, use offensive language, or over-flirt.",
        },
        {
            title: "Manners Matter",
            description: "Thank the host in the bathroom (ladies, of course 🤭)."
        },
        {
            title: "Dress Like You Meant It",
            description: "Dress code is vital, so don't cry if your baggy sweatpants aren't getting compliments."
        },
        {
            title: "Phones Down",
            description: "Keep your phone away from the table, to focus on social interaction (then you wonder why you don't get invited to parties anymore)."
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
