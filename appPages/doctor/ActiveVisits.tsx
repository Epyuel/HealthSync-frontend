'use client';
import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { EmblaCarouselType } from 'embla-carousel';
import Link from 'next/link';

interface Visit {
  id: number;
  name: string;
  contact: string;
  status: 'active' | 'ended';
  days: string;
  image?: string;
}

const visitsData: Visit[] = [
  { id: 1, name: 'Alemayehu T', contact: '0908818109', status: 'active', days: 'In 10 days', image: '' },
  { id: 2, name: 'Bekele M', contact: '0908818110', status: 'active', days: 'In 8 days', image: '' },
  { id: 3, name: 'Chaltu A', contact: '0908818111', status: 'active', days: 'In 5 days', image: "" },
  { id: 4, name: 'Desta K', contact: '0908818112', status: 'active', days: 'In 12 days', image: "" },
  { id: 5, name: 'Eleni G', contact: '0908818113', status: 'active', days: 'In 7 days', image: "" },
  { id: 6, name: 'Fikru L', contact: '0908818114', status: 'active', days: 'In 3 days', image: "" },
  { id: 7, name: 'Genet S', contact: '0908818115', status: 'ended', days: '2 days ago', image: '' },
  { id: 8, name: 'Haile T', contact: '0908818116', status: 'ended', days: '5 days ago', image: "" },
  { id: 9, name: 'Ibrahim B', contact: '0908818117', status: 'ended', days: '1 week ago', image: '' },
];

const ActiveVisits: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    slidesToScroll: 'auto',
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 1 }
    }
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const activeVisits = visitsData.filter(visit => visit.status === 'active');
  const endedVisits = visitsData.filter(visit => visit.status === 'ended');

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Active Visits Carousel */}
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Active Visits</h2>
      <div className="relative group">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {activeVisits.map((visit) => (
              <div key={visit.id} className="embla__slide min-w-0 sm:min-w-[300px] flex-grow-0 flex-shrink-0 basis-[80%] sm:basis-[300px] pr-4">
                <div className="rounded-tl-lg rounded-tr-lg shadow-md p-4 border border-gray-200 space-y-3 sm:space-y-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 mr-2">
                      <AvatarImage src={visit.image} alt={`${visit.name} profile`} />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {visit.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs sm:text-sm text-teal-500">{visit.days}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm sm:text-base text-gray-800 font-semibold">Name</p>
                    <span className="text-xs sm:text-sm">{visit.name}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between items-center">
                    <p className="text-sm sm:text-base text-gray-800 font-semibold">Contact</p>
                    <span className="text-xs sm:text-sm">{visit.contact}</span>
                  </div>
                  <div className="pt-3 flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      className="text-xs sm:text-sm bg-secondaryColor text-white px-2 sm:px-4 py-1 sm:py-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-xs sm:text-sm bg-primaryColor text-white px-2 sm:px-4 py-1 sm:py-2"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="w-full bg-primaryColor h-2 rounded-bl-lg rounded-br-lg"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 sm:p-2 shadow-lg w-8 h-8 sm:w-10 sm:h-10 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        
        <Button
          variant="ghost"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 sm:p-2 shadow-lg w-8 h-8 sm:w-10 sm:h-10 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Recently Ended Visits */}
      <div className="mt-8 sm:mt-12 md:pr-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recently Ended</h2>
          <Link href='/doctor/medicalhistory' className='text-sm text-secondaryColor hover:underline'>See More</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {endedVisits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 mr-2">
                  <AvatarImage src={visit.image} alt={`${visit.name} profile`} />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {visit.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs sm:text-sm text-teal-500">{visit.days}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base text-gray-800 font-semibold">Name</p>
                <span className="text-xs sm:text-sm">{visit.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base text-gray-800 font-semibold">Contact</p>
                <span className="text-xs sm:text-sm">{visit.contact}</span>
              </div>
              <div className="pt-3 flex justify-center">
                <Button 
                  variant="outline" 
                  className="text-xs sm:text-sm bg-secondaryColor text-white px-4 sm:px-6 py-1 sm:py-2"
                >
                  View History
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveVisits;