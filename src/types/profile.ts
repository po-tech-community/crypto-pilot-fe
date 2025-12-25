export interface Profile {
  userId: string;

  firstName: string;
  lastName: string;

  avatar?: string;
  phone?: string;

  countryId?: string; 
  joinDate: string;   
}
