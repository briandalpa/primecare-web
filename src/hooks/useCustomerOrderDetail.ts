import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { getCustomerOrderDetail } from '@/services/customerOrder';
import { OrderStatus, PaymentStatus } from '@/types/enums';
import { queryKeys } from '@/utils/queryKeys';

export const useCustomerOrderDetail = (id: string) => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: queryKeys.customerOrderDetail(id),
    queryFn: () => getCustomerOrderDetail(id),
    enabled: !!id && !!session,
    refetchIntervalInBackground: true,
    refetchInterval: (query) => {
      const innerPaymentStatus = query.state.data?.data?.payment?.status;
      const orderStatus = query.state.data?.data?.status;
      if (innerPaymentStatus === PaymentStatus.PENDING) return 3000;
      if (orderStatus === OrderStatus.WAITING_FOR_PAYMENT) return 3000;
      return false;
    },
  });
};
