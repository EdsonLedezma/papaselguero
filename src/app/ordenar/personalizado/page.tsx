import { Suspense } from "react";
import { OrderFlow } from "~/components/order-flow";

export default function CustomOrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderFlow customOnly />
    </Suspense>
  );
}
