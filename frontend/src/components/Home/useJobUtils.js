export const formatPostedDate = (createdAt) => {
    if (!createdAt) return "Recently";
    
    const now = new Date();
    const postedDate = new Date(createdAt);
    const diffTime = Math.abs(now - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

export const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Software Developer",
        company: "Tech Corp",
        image: "👩‍💻",
        text: "This platform helped me find my dream job in just 2 weeks. The process was smooth and opportunities were amazing!"
    },
    {
        name: "Michael Chen",
        role: "Product Manager",
        company: "StartupXYZ",
        image: "👨‍💼",
        text: "As an employer, I found qualified candidates quickly. The platform's features made hiring efficient and enjoyable."
    },
    {
        name: "Emily Davis",
        role: "UX Designer",
        company: "Design Studio",
        image: "👩‍🎨",
        text: "The user experience is fantastic! I landed a remote position that perfectly matches my skills and career goals."
    }
];
