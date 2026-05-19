import { Suspense } from "react";
import { OrderFlow } from "~/components/order-flow";

export default function OrderPage() {
  return (
    <Suspense fallback={null}>
      <OrderFlow />
    </Suspense>
  );
}
