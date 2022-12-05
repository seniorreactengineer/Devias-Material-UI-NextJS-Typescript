import { FC, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TextField,
  Box,
} from "@mui/material";
import { toast } from "react-hot-toast";

import { Scrollbar } from "@components/scrollbar";

import type { ShopDetailsItem } from "@interfaces/account";

import { shopwareConfig } from "../../../config";

interface ShopDetailsProps {
  shopDetails: ShopDetailsItem[];
  handleDelete: (name: string) => void;
}

export const AccountSettingsShopsDetails: FC<ShopDetailsProps> = (props) => {
  const { shopDetails, handleDelete, ...other } = props;
  const { t } = useTranslation();

  return (
    <Card {...other}>
      <CardHeader title={t("Shop Info")} />
      <Divider />
      <Scrollbar>
        <Box sx={{ minWidth: 700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("Host")}</TableCell>
                <TableCell>{t("Name")}</TableCell>
                <TableCell>{t("ApiKey")}</TableCell>
                <TableCell align="center">{t("Actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shopDetails.map((item) => (
                <ShopDetailListItem
                  key={item.apiKey}
                  host={item.host}
                  name={item.name}
                  apiKey={item.apiKey}
                  handleDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

interface shopDetailsItemProps {
  host: string;
  name: string;
  apiKey: string;
  handleDelete: (name: string) => void;
}
export const ShopDetailListItem: FC<shopDetailsItemProps> = (props) => {
  const { host, name, apiKey, handleDelete } = props;
  const [editToggle, setEditToggle] = useState<Boolean>(false);
  const [hostState, setHostState] = useState(host);
  const [nameState, setNameState] = useState(name);
  const [apiKeyState, setApiKeyState] = useState(apiKey);
  const { t } = useTranslation();

  const handleEditItem = (): void => {
    setEditToggle(!editToggle);
    if (editToggle) {
      //api integration
    }
  };

  const handleTest = (): void => {
    toast.success(t("Successfully configured") as string);
  };

  return (
    <TableRow>
      <TableCell>
        {editToggle ? (
          <TextField
            fullWidth
            inputProps={{
              style: {
                height: 0,
              },
            }}
            onChange={(event): void => setHostState(event.target.value)}
            value={hostState}
          />
        ) : (
          <span>{hostState}</span>
        )}
      </TableCell>
      <TableCell>
        {editToggle ? (
          <TextField
            fullWidth
            inputProps={{
              style: {
                height: 0,
              },
            }}
            onChange={(event): void => setNameState(event.target.value)}
            value={nameState}
          />
        ) : (
          <span>{nameState}</span>
        )}
      </TableCell>
      <TableCell>
        {editToggle ? (
          <TextField
            fullWidth
            inputProps={{
              style: {
                height: 0,
              },
            }}
            onChange={(event): void => setApiKeyState(event.target.value)}
            value={apiKeyState}
          />
        ) : (
          <span>{Array(apiKeyState.length + 1).join("*")}</span>
        )}
      </TableCell>
      <TableCell align="center" sx={{ display: "flex" }}>
        <Button onClick={handleEditItem}>{editToggle ? "Save" : "Edit"}</Button>
        <Button color="error" onClick={() => handleDelete(name)}>
          Delete
        </Button>
        <Button color="secondary" onClick={handleTest}>
          Test
        </Button>
      </TableCell>
    </TableRow>
  );
};

AccountSettingsShopsDetails.propTypes = {
  // @ts-ignore
  shopDetails: PropTypes.array.isRequired,
};

ShopDetailListItem.propTypes = {
  host: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
};
