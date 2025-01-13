export interface Advertisement {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  linkType: 'webpage' | 'wechat';
}