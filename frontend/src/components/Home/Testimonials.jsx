import React from 'react';

const Testimonials = ({ testimonials }) => {
    return (
        <section className="TestimonialsSection">
            <h2>Success Stories</h2>
            <div className="TestimonialsGrid">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="TestimonialCard">
                        <div className="TestimonialHeader">
                            <div className="Avatar">{testimonial.image}</div>
                            <div className="TestimonialInfo">
                                <h4>{testimonial.name}</h4>
                                <p>{testimonial.role} at {testimonial.company}</p>
                            </div>
                        </div>
                        <p className="TestimonialText">"{testimonial.text}"</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
