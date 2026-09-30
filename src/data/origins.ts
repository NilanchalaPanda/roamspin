export type OriginProfile = {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
};

// A deliberately small, curated city picker. Browser location can be used when
// a user wants a precise map origin; city selection is the privacy-friendly fallback.
const rawOrigins: Array<[string, string, number, number]> = [
  ['Mumbai','Maharashtra',19.0760,72.8777],['Pune','Maharashtra',18.5204,73.8567],['Nashik','Maharashtra',19.9975,73.7898],['Nagpur','Maharashtra',21.1458,79.0882],['Aurangabad','Maharashtra',19.8762,75.3433],
  ['Ahmedabad','Gujarat',23.0225,72.5714],['Surat','Gujarat',21.1702,72.8311],['Vadodara','Gujarat',22.3072,73.1812],['Rajkot','Gujarat',22.3039,70.8022],['Jaipur','Rajasthan',26.9124,75.7873],['Udaipur','Rajasthan',24.5854,73.7125],['Jodhpur','Rajasthan',26.2389,73.0243],
  ['Delhi','Delhi',28.6139,77.2090],['Chandigarh','Chandigarh',30.7333,76.7794],['Lucknow','Uttar Pradesh',26.8467,80.9462],['Agra','Uttar Pradesh',27.1767,78.0081],['Bhopal','Madhya Pradesh',23.2599,77.4126],['Indore','Madhya Pradesh',22.7196,75.8577],
  ['Bengaluru','Karnataka',12.9716,77.5946],['Mysuru','Karnataka',12.2958,76.6394],['Mangaluru','Karnataka',12.9141,74.8560],['Hyderabad','Telangana',17.3850,78.4867],['Chennai','Tamil Nadu',13.0827,80.2707],['Coimbatore','Tamil Nadu',11.0168,76.9558],
  ['Kochi','Kerala',9.9312,76.2673],['Thiruvananthapuram','Kerala',8.5241,76.9366],['Goa','Goa',15.2993,74.1240],['Panaji','Goa',15.4909,73.8278],['Bhubaneswar','Odisha',20.2961,85.8245],['Kolkata','West Bengal',22.5726,88.3639],
  ['Patna','Bihar',25.5941,85.1376],['Ranchi','Jharkhand',23.3441,85.3096],['Raipur','Chhattisgarh',21.2514,81.6296],['Guwahati','Assam',26.1445,91.7362],['Shillong','Meghalaya',25.5788,91.8933],['Gangtok','Sikkim',27.3389,88.6065],
  ['Dehradun','Uttarakhand',30.3165,78.0322],['Rishikesh','Uttarakhand',30.0869,78.2676],['Shimla','Himachal Pradesh',31.1048,77.1734],['Manali','Himachal Pradesh',32.2432,77.1892],['Srinagar','Jammu and Kashmir',34.0837,74.7973],['Leh','Ladakh',34.1526,77.5771],
  ['Visakhapatnam','Andhra Pradesh',17.6868,83.2185],['Vijayawada','Andhra Pradesh',16.5062,80.6480],['Pondicherry','Puducherry',11.9416,79.8083],['Bengaluru','Karnataka',12.9716,77.5946],
];

const mappedOrigins: OriginProfile[] = rawOrigins.map(([city,state,lat,lng]) => ({ id: city.toLowerCase().replace(/[^a-z0-9]+/g,'-'), city, state, lat, lng }));

export const originProfiles: OriginProfile[] = mappedOrigins;
export const defaultOrigin = originProfiles[0];
