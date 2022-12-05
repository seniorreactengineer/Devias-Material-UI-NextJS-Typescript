import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import axios from "axios";

import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";

import { AuthGuard } from "@components/authentication/auth-guard";
import { DashboardLayout } from "@components/dashboard/dashboard-layout";
import { OrderDrawer } from "@components/dashboard/order/order-drawer";
import { OrderListTable } from "@components/dashboard/order/order-list-table";
import { OrdersListFilters } from "@components/dashboard/order/order-list-filters";

import { Plus as PlusIcon } from "@icons/plus";

import { useMounted } from "@hooks/use-mounted";
import { useAsync } from "@hooks/use-async";

import { shopwareConfig } from "../../../config";

import shopwareClient from "@lib/shopware";
import { gtm } from "@lib/gtm";

import type { Order } from "@interfaces/order";
interface Filters {
  query?: string | "";
  orderStatus?: string[];
  paymentStatus?: string[];

  name?: string | undefined;
  country: string[];
  payment: string[];
  customer: string[];
  status: string[];
  sort: "asc" | "desc";
}

interface CurrentTab {
  currentOrderTab: string;
  currentShipTab: string;
}

const severityMap = (state) => {
  switch (state) {
    case 0:
      return { color: "info", state: "open" };
    case 1:
      return { color: "success", state: "completely delivered" };
    case 2:
      return { color: "warning", state: "returned" };
    case 3:
      return { color: "error", state: "canceled" };
  }
};
const severityMapPayment = (state) => {
  switch (state) {
    case 0:
      return { color: "info", state: "open" };
    case 1:
      return { color: "success", state: "completely paid" };
    case 2:
      return { color: "warning", state: "partly invoiced" };
    case 3:
      return { color: "error", state: "completely invoiced" };
  }
};

const applyFilters = (orders: Order[], filters: Filters) =>
  orders.filter((order) => {
    if (filters.country.length) {
      // Checks only the order number, but can be extended to support other fields, such as customer
      // name, email, etc.
      const containsQuery = filters.country
        .join()
        .toLowerCase()
        .includes(order.shipping.country.isoName.toLowerCase());

      if (!containsQuery) {
        return false;
      }
    }

    if (filters.payment.length) {
      // Checks only the order number, but can be extended to support other fields, such as customer
      // name, email, etc.
      const containsQuery = filters.payment
        .join()
        .toLowerCase()
        .includes(order.payment.description.toLowerCase());

      if (!containsQuery) {
        return false;
      }
    }

    if (filters.customer.length) {
      // Checks only the order number, but can be extended to support other fields, such as customer
      // name, email, etc.
      const containsQuery = filters.customer
        .join()
        .toLowerCase()
        .includes(order.dispatch.customerGroupName.toLowerCase());

      if (!containsQuery) {
        return false;
      }
    }

    if (
      filters.orderStatus.length &&
      !filters.orderStatus.join().toLowerCase().includes("all")
    ) {
      // Checks only the order number, but can be extended to support other fields, such as customer
      // name, email, etc.

      const containsQuery = filters.orderStatus
        .join()
        .toLowerCase()
        .includes(
          severityMap(order.orderStatus.position % 4).state.toLowerCase()
        );

      if (!containsQuery) {
        return false;
      }
    }

    if (filters.paymentStatus.length === 0) return false;
    if (filters.orderStatus.length === 0) return false;
    if (
      filters.paymentStatus.length &&
      !filters.paymentStatus.join().toLowerCase().includes("all")
    ) {
      // Checks only the order number, but can be extended to support other fields, such as customer
      // name, email, etc.

      const containsQuery = filters.paymentStatus
        .join()
        .toLowerCase()
        .includes(
          severityMapPayment(
            order.paymentStatus.position % 4
          ).state.toLowerCase()
        );

      if (!containsQuery) {
        return false;
      }
    }

    return true;
  });

const applySort = (orders: Order[], order: "asc" | "desc") =>
  orders.sort((a, b) => {
    const comparator = a.changed > b.changed ? -1 : 1;

    return order === "desc" ? comparator : -comparator;
  });

const applyPagination = (
  orders: Order[],
  page: number,
  rowsPerPage: number
): Order[] =>
  orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const OrderListInner = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  overflow: "hidden",
  paddingBottom: theme.spacing(8),
  paddingTop: theme.spacing(8),
  zIndex: 1,
  [theme.breakpoints.up("lg")]: {
    marginRight: -500,
  },
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.up("lg")]: {
      marginRight: 0,
    },
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const OrderList: NextPage<Order[]> = ({ paymentData, customerData }: any) => {
  const isMounted = useMounted();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(100);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState<Filters>({
    query: "",
    orderStatus: [],
    paymentStatus: [],

    name: undefined,
    country: [],
    payment: [],
    customer: [],
    status: [],
    sort: "desc",
  });

  const [drawer, setDrawer] = useState<{ isOpen: boolean; orderId?: string }>({
    isOpen: false,
    orderId: null,
  });

  const getOrderDetails = async () => {
    try {
      const orders = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/orders`
      );

      const orderData = await Promise.all(
        orders.data.data.map(async (order: Order): Promise<Order> => {
          const newOrder = await axios(
            `${process.env.NEXT_PUBLIC_HOST_URL}/api/orders/${order.id}`
          );
          return newOrder.data.data;
        })
      );

      const realOrder = orderData.filter((order) => order !== undefined);

      const orderList = await Promise.all(
        realOrder.map(async (order: Order): Promise<Order> => {
          const groupName = customerData.find(
            (customer) => customer.key === order.customer.groupKey
          )?.name;
          return {
            ...order,
            dispatch: {
              ...order?.dispatch,
              customerGroupName: groupName,
            },
          };
        })
      );

      return orderList;
    } catch (error) {
      console.log(error.message);
    }
  };

  const { run, status, value } = useAsync();

  useEffect(() => {
    gtm.push({ event: "page_view" });
    run(getOrderDetails());
  }, []);

  useEffect(() => {
    if (status === "success") setOrders(value);
  }, [status]);

  const handlePageChange = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleOpenDrawer = (orderId: string): void => {
    setDrawer({
      isOpen: true,
      orderId,
    });
  };

  const handleCloseDrawer = () => {
    setDrawer({
      isOpen: false,
      orderId: null,
    });
  };

  // Usually query is done on backend with indexing solutions
  const filteredOrders = applyFilters(orders, filters);
  const sortedOrders = applySort(filteredOrders, filters.sort);
  const paginatedOrders = applyPagination(sortedOrders, page, rowsPerPage);

  return (
    <>
      <Head>
        <title>Dashboard: Order List | Material Kit Pro</title>
      </Head>
      <Box
        component="main"
        ref={rootRef}
        sx={{
          backgroundColor: "background.paper",
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <OrderListInner open={drawer.isOpen}>
          <Box sx={{ px: 3 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Orders</Typography>
              </Grid>
              {/* <Grid item>
                <Button
                  startIcon={<PlusIcon fontSize="small" />}
                  variant="contained"
                >
                  Add
                </Button>
              </Grid> */}
            </Grid>
          </Box>
          <OrdersListFilters
            paymentList={paymentData}
            customerGroupList={customerData}
            currentFilter={filters}
            onChange={(value) => setFilters((prev) => ({ ...prev, ...value }))}
          />
          <Divider />

          {status !== "success" ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <OrderListTable
              onOpenDrawer={handleOpenDrawer}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              orders={paginatedOrders}
              ordersCount={filteredOrders.length}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          )}
        </OrderListInner>
        <OrderDrawer
          containerRef={rootRef}
          onClose={handleCloseDrawer}
          open={drawer.isOpen}
          order={orders.find((order) => order.id === drawer.orderId)}
        />
      </Box>
    </>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  const paymentData = await shopwareClient("paymentMethods");
  const customerData = await shopwareClient("customerGroups");

  // Pass data to the page via props
  return {
    props: {
      paymentData: paymentData.data.data,
      customerData: customerData.data.data,
    },
  };
}

OrderList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default OrderList;
