export type VehiclePhotoMeta = {
  url: string
  alt: string
  credit?: string
  creditUrl?: string
}

type VehiclePhotoLibraryEntry = {
  default: VehiclePhotoMeta
  years?: Record<string, VehiclePhotoMeta>
  models?: Record<string, VehiclePhotoMeta>
}

type VehiclePhotoLibrary = Record<string, VehiclePhotoLibraryEntry>

const fallbackPhoto: VehiclePhotoMeta = {
  url: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&h=900',
  alt: 'Premium coupe captured in studio lighting representing the Edmonton Cars inventory.',
  credit: 'Pexels',
  creditUrl: 'https://www.pexels.com/',
}

const vehiclePhotoLibrary: VehiclePhotoLibrary = {
  acura: {
    default: {
      url: 'https://images.pexels.com/photos/9190730/pexels-photo-9190730.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Silver coupe representing Acura performance lineup.',
      credit: 'Erik Mclean',
      creditUrl: 'https://www.pexels.com/photo/9190730/',
    },
  },
  astonmartin: {
    default: {
      url: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'British grand tourer under studio spotlights representing Aston Martin craftsmanship.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402787/',
    },
  },
  audi: {
    default: {
      url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'White sport coupe overlooking a mountain pass representing Audi design.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/170811/',
    },
  },
  bentley: {
    default: {
      url: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Luxury grand tourer parked curbside representing Bentley.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/210019/',
    },
  },
  bmw: {
    default: {
      url: 'https://images.pexels.com/photos/1402785/pexels-photo-1402785.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Blue performance coupe showcasing BMW M division styling.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402785/',
    },
  },
  bugatti: {
    default: {
      url: 'https://images.pexels.com/photos/1402789/pexels-photo-1402789.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Hypercar silhouette representing Bugatti craftsmanship.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402789/',
    },
  },
  cadillac: {
    default: {
      url: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Classic luxury coupe tailfin representing Cadillac heritage.',
      credit: 'Alex Powell',
      creditUrl: 'https://www.pexels.com/photo/1007410/',
    },
  },
  chevrolet: {
    default: {
      url: 'https://images.pexels.com/photos/981062/pexels-photo-981062.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'American muscle car representing Chevrolet performance.',
      credit: 'Josh Wilburne',
      creditUrl: 'https://www.pexels.com/photo/981062/',
    },
  },
  ferrari: {
    default: {
      url: 'https://images.pexels.com/photos/1402783/pexels-photo-1402783.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Red supercar representing Ferrari design language.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402783/',
    },
  },
  ford: {
    default: {
      url: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Blue coupe representing Ford performance heritage.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/1149831/',
    },
  },
  gmc: {
    default: {
      url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Premium SUV representing GMC capability.',
      credit: 'Luis Quintero',
      creditUrl: 'https://www.pexels.com/photo/2724749/',
    },
  },
  honda: {
    default: {
      url: 'https://images.pexels.com/photos/5074101/pexels-photo-5074101.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Red hot hatch representing Honda enthusiast culture.',
      credit: 'Tobi',
      creditUrl: 'https://www.pexels.com/photo/5074101/',
    },
  },
  hyundai: {
    default: {
      url: 'https://images.pexels.com/photos/6980717/pexels-photo-6980717.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Modern electric crossover representing Hyundai innovation.',
      credit: 'Kindel Media',
      creditUrl: 'https://www.pexels.com/photo/6980717/',
    },
  },
  jaguarlandrover: {
    default: {
      url: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Luxury SUV overlooking the mountains representing Jaguar Land Rover.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/116675/',
    },
  },
  jeep: {
    default: {
      url: 'https://images.pexels.com/photos/115223/pexels-photo-115223.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Trail-ready 4x4 representing Jeep capability.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/115223/',
    },
  },
  kia: {
    default: {
      url: 'https://images.pexels.com/photos/4870706/pexels-photo-4870706.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Urban crossover representing the Kia lineup.',
      credit: 'Mstudio Images',
      creditUrl: 'https://www.pexels.com/photo/4870706/',
    },
    years: {
      '2024': {
        url: 'https://images.pexels.com/photos/5493320/pexels-photo-5493320.jpeg?auto=compress&cs=tinysrgb&h=900',
        alt: 'Forest trail photoshoot representing the 2024 Kia Sportage range.',
        credit: 'Toms Svilans',
        creditUrl: 'https://www.pexels.com/photo/5493320/',
      },
    },
  },
  lamborghini: {
    default: {
      url: 'https://images.pexels.com/photos/1402784/pexels-photo-1402784.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Yellow supercar representing Lamborghini artistry.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402784/',
    },
  },
  mahindra: {
    default: {
      url: 'https://images.pexels.com/photos/8041283/pexels-photo-8041283.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Rugged SUV representing Mahindra utility vehicles.',
      credit: 'Taryn Elliott',
      creditUrl: 'https://www.pexels.com/photo/8041283/',
    },
  },
  marutisuzuki: {
    default: {
      url: 'https://images.pexels.com/photos/1031955/pexels-photo-1031955.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Compact hatchback representing Maruti Suzuki city cars.',
      credit: 'Naveed Ahmed',
      creditUrl: 'https://www.pexels.com/photo/1031955/',
    },
  },
  mazda: {
    default: {
      url: 'https://images.pexels.com/photos/6408373/pexels-photo-6408373.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Convertible sports car representing Mazda enthusiast models.',
      credit: 'Erik Mclean',
      creditUrl: 'https://www.pexels.com/photo/6408373/',
    },
  },
  mercedes: {
    default: {
      url: 'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Silver coupe representing Mercedes-AMG performance.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/112460/',
    },
  },
  mitsubishi: {
    default: {
      url: 'https://images.pexels.com/photos/1592381/pexels-photo-1592381.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Crossover on the coast representing Mitsubishi adventure vehicles.',
      credit: 'Erik Mclean',
      creditUrl: 'https://www.pexels.com/photo/1592381/',
    },
  },
  nissan: {
    default: {
      url: 'https://images.pexels.com/photos/1402781/pexels-photo-1402781.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Midnight city shot representing Nissan performance cars.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402781/',
    },
  },
  peugeot: {
    default: {
      url: 'https://images.pexels.com/photos/1484138/pexels-photo-1484138.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'European hatchback representing Peugeot design.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/1484138/',
    },
  },
  porsche: {
    default: {
      url: 'https://images.pexels.com/photos/210042/pexels-photo-210042.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Silver sports car representing Porsche engineering.',
      credit: 'Mike',
      creditUrl: 'https://www.pexels.com/photo/210042/',
    },
  },
  rollsroyce: {
    default: {
      url: 'https://images.pexels.com/photos/716747/pexels-photo-716747.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Ultra-luxury sedan detail representing Rolls-Royce.',
      credit: 'Tima Miroshnichenko',
      creditUrl: 'https://www.pexels.com/photo/716747/',
    },
  },
  tatamotors: {
    default: {
      url: 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Compact hatchback representing Tata Motors everyday lineup.',
      credit: 'Pixabay',
      creditUrl: 'https://www.pexels.com/photo/164634/',
    },
  },
  tesla: {
    default: {
      url: 'https://images.pexels.com/photos/2449749/pexels-photo-2449749.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Electric sedan charging representing Tesla.',
      credit: 'Lukas',
      creditUrl: 'https://www.pexels.com/photo/2449749/',
    },
  },
  toyota: {
    default: {
      url: 'https://images.pexels.com/photos/982005/pexels-photo-982005.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Performance coupe representing Toyota Gazoo Racing models.',
      credit: 'Jayson Hinrichsen',
      creditUrl: 'https://www.pexels.com/photo/982005/',
    },
  },
  volkswagen: {
    default: {
      url: 'https://images.pexels.com/photos/1402780/pexels-photo-1402780.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Modern hatchback representing Volkswagen design.',
      credit: 'Marius Muresan',
      creditUrl: 'https://www.pexels.com/photo/1402780/',
    },
  },
  volvo: {
    default: {
      url: 'https://images.pexels.com/photos/2441165/pexels-photo-2441165.jpeg?auto=compress&cs=tinysrgb&h=900',
      alt: 'Scandinavian SUV representing Volvo safety-first design.',
      credit: 'Lina Kivaka',
      creditUrl: 'https://www.pexels.com/photo/2441165/',
    },
  },
}

function normaliseKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

function normaliseModel(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function getVehiclePhoto(make: string, model: string, year: string | null): VehiclePhotoMeta {
  const normalisedMake = normaliseKey(make)
  const entry = vehiclePhotoLibrary[normalisedMake]

  if (!entry) {
    return fallbackPhoto
  }

  if (year && entry.years?.[year]) {
    return entry.years[year]
  }

  if (entry.models) {
    const normalisedModel = normaliseModel(model)
    if (normalisedModel && entry.models[normalisedModel]) {
      return entry.models[normalisedModel]
    }
  }

  return entry.default ?? fallbackPhoto
}

export function getVehiclePhotoCredit(make: string, model: string, year: string | null): VehiclePhotoMeta {
  return getVehiclePhoto(make, model, year)
}
