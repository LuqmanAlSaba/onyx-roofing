'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import QuoteCTA from '@/app/components/Blog/QuoteCTA';

const ConsultationForm = dynamic(() => import('@/app/components/ConsultationForm'), {
    ssr: false, // Form is client-side interaction only
});

interface BlogPostClientProps {
    ctaTitle?: string;
    ctaDescription?: string;
    ctaButtonText?: string;
    initialService?: string;
}

export default function BlogPostClient({ ctaTitle, ctaDescription, ctaButtonText, initialService = "Roof Inspection" }: BlogPostClientProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            {/* Consultation Form Overlay */}
            {isFormOpen && (
                <ConsultationForm
                    open={isFormOpen}
                    onClose={() => setIsFormOpen(false)}
                    initialService={initialService}
                />
            )}

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
