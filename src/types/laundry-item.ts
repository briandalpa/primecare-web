export type LaundryItem = {
  id: string;
  name: string;
  slug: string;
};

export type LaundryItemListResponse = {
  status: string;
  message: string;
  data: LaundryItem[];
};
