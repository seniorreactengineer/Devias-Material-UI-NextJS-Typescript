import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FC, KeyboardEvent } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Chip,
  Divider,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Checkbox,
  MenuItem,
  FormControlLabel,
  Menu,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { Search as SearchIcon } from "@icons/search";
import { MultiSelect } from "../../multi-select";
import { StatusSelect } from "./status-filter";

import type { Payment, CustomerGroup } from "@interfaces/order";

export interface Filters {
  query?: string;
  orderStatus?: string[];
  paymentStatus?: string[];

  name?: string;
  country: string[];
  payment: string[];
  status: string[];
  sort: "asc" | "desc";
}

interface OrdersListFiltersProps {
  onChange?: (Object) => void;
  currentFilter: Filters;
  paymentList: Payment[];
  customerGroupList: CustomerGroup[];
}

interface FilterItem {
  label: string;
  field: "country" | "payment" | "customer" | "orderStatus" | "paymentStatus";
  value: unknown;
  displayValue?: unknown;
}

const standardOption = [
  {
    label: "ZALANDO DE",
    value: "zalandoDe",
    filters: [
      {
        label: "Country",
        field: "country",
        value: "germany",
        displayValue: "Germany",
      },
      {
        label: "Payment",
        field: "payment",
        value: "zalando",
        displayValue: "Zalando",
      },
      {
        label: "Customer",
        field: "customer",
        value: "zalando",
        displayValue: "Zalando",
      },
    ],
  },
];

const negativeStandardOption = [
  {
    label: "ZALANDO NOT DE",
    value: "zalandoNotDe",
    negative: {
      label: "Country",
      field: "country",
      value: "germany",
      displayValue: "Germany",
    },
    positive: [
      {
        label: "Payment",
        field: "payment",
        value: "zalando",
        displayValue: "Zalando",
      },
      {
        label: "Customer",
        field: "customer",
        value: "zalando",
        displayValue: "Zalando",
      },
    ],
  },
];
/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
const useUpdateEffect = (effect, dependencies = []) => {
  const isInitialMount = useRef(true);

  useEffect(
    () => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        return effect();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies
  );
};

export const OrdersListFilters: FC<OrdersListFiltersProps> = (props) => {
  const { onChange, currentFilter, paymentList, customerGroupList, ...other } =
    props;
  const [queryValue, setQueryValue] = useState<string>("");
  const queryRef = useRef<HTMLInputElement | null>(null);
  const [filterItems, setFilterItems] = useState<FilterItem[]>([
    {
      label: "OrderStatus",
      field: "orderStatus",
      value: "open",
      displayValue: "OPEN",
    },
    {
      label: "PaymentStatus",
      field: "paymentStatus",
      value: "completely paid",
      displayValue: "COMPLETELY PAID",
    },
    {
      label: "PaymentStatus",
      field: "paymentStatus",
      value: "partly invoiced",
      displayValue: "PARTLY INVOICED",
    },
    {
      label: "PaymentStatus",
      field: "paymentStatus",
      value: "completely invoiced",
      displayValue: "COMPLETELY INVOICED",
    },
  ]);
  const [standard, setStandard] = useState<unknown[]>([]);
  const [negativeStandard, setNegativeStandard] = useState<unknown[]>([]);

  const paymentOption = useMemo(() => {
    return paymentList.map((paymentItem) => ({
      label: paymentItem.description,
      value: paymentItem.description.toLowerCase(),
    }));
  }, [paymentList]);

  const customerOption = useMemo(() => {
    return customerGroupList.map((customer) => ({
      label: customer.name,
      value: customer.name.toLowerCase(),
    }));
  }, [customerGroupList]);

  const { t } = useTranslation();

  const orderStatusOption = [
    {
      label: t("ALL"),
      value: "all",
    },
    {
      label: t("OPEN"),
      value: "open",
    },
    {
      label: t("COMPLETELY DELIVERED"),
      value: "completely delivered",
    },
    {
      label: t("RETURNED"),
      value: "returned",
    },
    {
      label: t("CANCELED"),
      value: "canceled",
    },
  ];

  const paymentStatusOption = [
    {
      label: t("ALL"),
      value: "all",
    },
    {
      label: t("OPEN"),
      value: "open",
    },
    {
      label: t("COMPLETLY PAID"),
      value: "completely paid",
    },
    {
      label: t("PARTLY INVOICED"),
      value: "partly invoiced",
    },
    {
      label: t("COMPETELY INVOICED"),
      value: "completely invoiced",
    },
  ];

  const sortOptions = [
    {
      label: t("Newest"),
      value: "desc",
    },
    {
      label: t("Oldest"),
      value: "asc",
    },
  ];

  const countryOptions = [
    {
      label: t("France"),
      value: "france",
    },
    {
      label: t("Germany"),
      value: "germany",
    },
    {
      label: t("Austria"),
      value: "austria",
    },
  ];

  useUpdateEffect(
    () => {
      const filters = {
        name: undefined,
        country: [],
        status: [],
        payment: [],
        customer: [],
        orderStatus: [],
        paymentStatus: [],
        sort: "desc",
      };

      // Transform the filter items in an object that can be used by the parent component to call the
      // serve with the updated filters
      filterItems.forEach((filterItem) => {
        switch (filterItem.field) {
          case "country":
            filters.country.push(filterItem.value);
            break;
          case "payment":
            filters.payment.push(filterItem.value);
            break;
          case "customer":
            filters.customer.push(filterItem.value);
            break;
          case "orderStatus":
            filters.orderStatus.push(filterItem.value);
            break;
          case "paymentStatus":
            filters.paymentStatus.push(filterItem.value);
            break;
          default:
            break;
        }
      });

      onChange?.(filters as Filters);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterItems]
  );

  const handleSortChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value as "asc" | "desc";
    onChange?.({
      sort: value,
    });
  };

  const handleDelete = (filterItem: FilterItem): void => {
    setStandard([]);
    setFilterItems((prevState) =>
      prevState.filter((_filterItem) => {
        return !(
          filterItem.field === _filterItem.field &&
          filterItem.value === _filterItem.value
        );
      })
    );
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();

    if (queryRef?.current?.value) {
      const filterItem = filterItems.find(
        (filterItem) => filterItem.field === "country"
      );

      if (filterItem) {
        setFilterItems((prevState) =>
          prevState.map((filterItem) => {
            if (filterItem.field === "country") {
              return {
                ...filterItem,
                value: queryRef?.current?.value,
              };
            }

            return filterItem;
          })
        );
      } else {
        setFilterItems((prevState) => [
          ...prevState,
          {
            label: "Country",
            field: "country",
            value: queryRef?.current?.value,
          },
        ]);
      }
    }

    setQueryValue(queryRef?.current?.value);
  };

  const handleCategoryChange = (values: unknown[]): void => {
    setStandard([]);
    setFilterItems((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== "country") {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = countryOptions.find(
            (option) => option.value === value
          );

          newFilterItems.push({
            label: "Country",
            field: "country",
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handlePaymentCategoryChange = (values: unknown[]): void => {
    setStandard([]);
    setFilterItems((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== "payment") {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = paymentOption.find((option) => option.value === value);

          newFilterItems.push({
            label: "Payment",
            field: "payment",
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handleCustomerCategoryChange = (values: unknown[]): void => {
    setStandard([]);
    setFilterItems((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== "customer") {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = customerOption.find(
            (option) => option.value === value
          );

          newFilterItems.push({
            label: "Customer",
            field: "customer",
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handleStandardCategoryChange = (values: unknown[]): void => {
    setStandard(values);

    const extendValues = values.map(
      (value) => standardOption.filter((item) => item.value === value)[0]
    );

    setFilterItems((prevState: FilterItem[]) => {
      const newState = [];

      extendValues.forEach((extendValue) => {
        extendValue.filters.forEach((item) => {
          newState.push(item);
        });
      });

      return newState;
    });
  };

  const handleNegativeStandardChange = (values: unknown[]): void => {
    setStandard([]);

    setNegativeStandard(values);

    const negativeCountries = values.map(
      (value) =>
        negativeStandardOption.filter((item) => item.value === value)[0]
          .negative.value
    );
    const positiveValues = [];
    values.forEach((value) => {
      negativeStandardOption
        .filter((item) => item.value === value)[0]
        .positive.map((positiveItem) => {
          positiveValues.push(positiveItem);
        });
    });

    setFilterItems(() => {
      const newFilterItems = [];

      if (!negativeCountries.length) {
        return newFilterItems;
      }

      const countryValues = countryOptions.filter((filterItem) => {
        if (!negativeCountries.includes(filterItem.value)) {
          return true;
        }
        return false;
      });
      countryValues.forEach((item) => {
        newFilterItems.push({
          label: "Country",
          field: "country",
          value: item.value,
          displayValue: item.label,
        });
      });

      positiveValues.forEach((item) => {
        newFilterItems.push(item);
      });

      return newFilterItems;
    });
  };

  const handleOrderStatusChange = (values: unknown[]): void => {
    setFilterItems((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== "orderStatus") {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = orderStatusOption.find(
            (option) => option.value === value
          );

          newFilterItems.push({
            label: "OrderStatus",
            field: "orderStatus",
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  const handlePaymentStatusChange = (values: unknown[]): void => {
    if (values.includes("all")) {
      setFilterItems;
    }
    setFilterItems((prevState) => {
      const valuesFound = [];

      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => {
        if (filterItem.field !== "paymentStatus") {
          return true;
        }

        const found = values.includes(filterItem.value);

        if (found) {
          valuesFound.push(filterItem.value);
        }

        return found;
      });

      // Nothing changed
      if (values.length === valuesFound.length) {
        return newFilterItems;
      }

      values.forEach((value) => {
        if (!valuesFound.includes(value)) {
          const option = paymentStatusOption.find(
            (option) => option.value === value
          );

          newFilterItems.push({
            label: "PaymentStatus",
            field: "paymentStatus",
            value,
            displayValue: option.label,
          });
        }
      });

      return newFilterItems;
    });
  };

  // We memoize this part to prevent re-render issues
  const countryCategoryValues = useMemo(
    () =>
      filterItems
        .filter((filterItems) => filterItems.field === "country")
        .map((filterItems) => filterItems.value),
    [filterItems]
  );

  const paymentCategoryValues = useMemo(
    () =>
      filterItems
        .filter((filterItems) => filterItems.field === "payment")
        .map((filterItems) => filterItems.value),
    [filterItems]
  );

  const customerCategoryValues = useMemo(
    () =>
      filterItems
        .filter((filterItems) => filterItems.field === "customer")
        .map((filterItems) => filterItems.value),
    [filterItems]
  );

  const orderStatusValues = useMemo(
    () =>
      filterItems
        .filter((filterItems) => filterItems.field === "orderStatus")
        .map((filterItems) => filterItems.value),
    [filterItems]
  );

  const paymentStatusValues = useMemo(
    () =>
      filterItems
        .filter((filterItems) => filterItems.field === "paymentStatus")
        .map((filterItems) => filterItems.value),
    [filterItems]
  );

  return (
    <div {...other}>
      <Box sx={{ px: 3 }}>
        <StatusSelect
          label="orderStatus"
          onChange={(value) => handleOrderStatusChange(value)}
          options={orderStatusOption}
          value={orderStatusValues}
        />
        <StatusSelect
          label="paymentStatus"
          onChange={(value) => handlePaymentStatusChange(value)}
          options={paymentStatusOption}
          value={paymentStatusValues}
        />
      </Box>
      <Divider />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          m: -1.5,
          p: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleQueryChange}
          sx={{
            flexGrow: 1,
            m: 1.5,
          }}
        >
          <TextField
            defaultValue=""
            fullWidth
            inputProps={{ ref: queryRef }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            placeholder={t("Search by order number")}
          />
        </Box>
        <TextField
          label={t("Sort By")}
          name="order"
          onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          sx={{ m: 1.5 }}
          value={currentFilter.sort}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
      </Box>
      <Divider />
      {filterItems.length > 0 ? (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            p: 2,
          }}
        >
          {filterItems.map((filterItem, i) => (
            <Chip
              key={i}
              label={
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    "& span": {
                      fontWeight: 600,
                    },
                  }}
                >
                  <span>{filterItem.label}</span>:{" "}
                  {filterItem.displayValue || filterItem.value}
                </Box>
              }
              onDelete={(): void => handleDelete(filterItem)}
              sx={{ m: 1 }}
              variant="outlined"
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ p: 3 }}>
          <Typography color="textSecondary" variant="subtitle2">
            No filters applied
          </Typography>
        </Box>
      )}
      <Divider />
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          p: 1,
        }}
      >
        <MultiSelect
          label={t("Country")}
          onChange={(value) => handleCategoryChange(value)}
          options={countryOptions}
          value={countryCategoryValues}
        />
        <MultiSelect
          label={t("Payment")}
          onChange={(value) => handlePaymentCategoryChange(value)}
          options={paymentOption}
          value={paymentCategoryValues}
        />
        <MultiSelect
          label={t("Customer")}
          onChange={(value) => handleCustomerCategoryChange(value)}
          options={customerOption}
          value={customerCategoryValues}
        />
        <MultiSelect
          label={t("Standard")}
          onChange={(value) => handleStandardCategoryChange(value)}
          options={standardOption}
          value={standard}
        />
        <MultiSelect
          label={t("NeStandard")}
          onChange={(value) => handleNegativeStandardChange(value)}
          options={negativeStandardOption}
          value={negativeStandard}
        />
      </Box>
    </div>
  );
};

OrdersListFilters.propTypes = {
  onChange: PropTypes.func,
};
