'use client';

import { useState } from 'react';
import QuoteCTA from '@/app/components/Blog/QuoteCTA';
import ConsultationForm from '@/app/components/ConsultationForm';

interface BlogPostClientProps {
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
}

export default function BlogPostClient({ ctaTitle, ctaDescription, ctaButtonText }: BlogPostClientProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            {/* Consultation Form Overlay */}
            <ConsultationForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                initialService="Roof Inspection"
            />

            {/* CTA with form trigger */}
            <QuoteCTA
                onOpenForm={() => setIsFormOpen(true)}
                title={ctaTitle}
                description={ctaDescription}
                buttonText={ctaButtonText}
            />
        </>
    );
}
