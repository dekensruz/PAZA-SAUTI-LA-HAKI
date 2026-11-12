import { mediaUrl } from '@/lib/media';

export interface TeamMember {
  id: string;
  name: string;
  image: string;
}

const member = (id: string, name: string, file: string): TeamMember => ({ id, name, image: mediaUrl(`team/${file}.webp`) });

export const teamMembers: TeamMember[] = [
  member('1', 'MWANGILWA KITUNGANO Gédéon', 'mwangilwa-kitungano-gedeon'),
  member('2', 'Balola Mugisho Daniel', 'balola-mugisho-daniel'),
  member('3', 'Dekens Ruzuba', 'dekens-ruzuba'),
  member('4', 'Byeka Kipanga Chanceline', 'byeka-kipanga-chanceline'),
  member('5', 'SAFARI MUZERO Xavier', 'safari-muzero-xavier'),
  member('6', 'Nabintu Bisimwa Clémence', 'nabintu-bisimwa-clemence'),
  member('7', 'Irazika Bamporiki Vertueuse', 'irazika-bamporiki-vertueuse'),
  member('8', 'Miderho Magadju Dieumerci', 'miderho-magadju-dieumerci'),
  member('9', 'Furaha Zirimwagabo Nessia', 'furaha-zirimwagabo-nessia'),
  member('10', 'Habamungu Magendo Augustin', 'habamungu-magendo-augustin'),
  member('11', 'Karisi Kaboyo Bénédicte', 'karisi-kaboyo-benedicte'),
];
