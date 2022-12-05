import { ChangeEvent, Fragment, MouseEvent, useState } from "react";
import type { FC } from "react";
import numeral from "numeral";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Image as ImageIcon } from "@icons/image";
import { Search as SearchIcon } from "@icons/search";
import type { Product } from "@interfaces/product";
import { Scrollbar } from "../../scrollbar";

interface ProductListTableProps {
  onPageChange?: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  products: Product[];
  productsCount: number;
  rowsPerPage: number;
}

const categoryOptions = [
  {
    label: "Healthcare",
    value: "healthcare",
  },
  {
    label: "Makeup",
    value: "makeup",
  },
  {
    label: "Dress",
    value: "dress",
  },
  {
    label: "Skincare",
    value: "skincare",
  },
  {
    label: "Jewelry",
    value: "jewelry",
  },
  {
    label: "Blouse",
    value: "blouse",
  },
];

let date = new Date(2011, 0, 1, 2, 3, 4, 567);

export const ProductListTable: FC<ProductListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    productsCount,
    rowsPerPage,
    ...other
  } = props;
  const [openProduct, setOpenProduct] = useState<string>(null);

  const handleOpenProduct = (productId: string): void => {
    setOpenProduct((prevValue) => (prevValue === productId ? null : productId));
  };

  const handleUpdateProduct = (): void => {
    setOpenProduct(null);
    toast.success("Product updated");
  };

  const handleCancelEdit = (): void => {
    setOpenProduct(null);
  };

  const handleDeleteProduct = (): void => {
    toast.error("Product cannot be deleted");
  };

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="25%">Product ID</TableCell>
              <TableCell width="50%">Name</TableCell>
              <TableCell width="6%">Category</TableCell>
              <TableCell width="10%">Date</TableCell>
              <TableCell width="5%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const open = product.id === openProduct;

              return (
                <Fragment key={product.id}>
                  <TableRow hover key={product.id}>
                    <TableCell
                      width="25%"
                    >
                      <Typography
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >{product.id}</Typography>
                    </TableCell>
                    <TableCell width="50%">
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {product.image ? (
                          <Box
                            sx={{
                              alignItems: "center",
                              backgroundColor: "background.default",
                              backgroundImage: `url(${product.image})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderRadius: 1,
                              display: "flex",
                              height: 80,
                              justifyContent: "center",
                              overflow: "hidden",
                              width: 80,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              alignItems: "center",
                              backgroundColor: "background.default",
                              borderRadius: 1,
                              display: "flex",
                              height: 80,
                              justifyContent: "center",
                              width: 80,
                            }}
                          >
                            <ImageIcon fontSize="small" />
                          </Box>
                        )}
                        <Box
                          sx={{
                            cursor: "pointer",
                            ml: 2,
                          }}
                        >
                          <Typography 
                            variant="subtitle2" 
                            sx={{
                              width: "100%",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}>
                            {product.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell width="6%">
                      <Typography>{product.category}</Typography>
                    </TableCell>
                    <TableCell width="10%">
                      <Typography>{date.toDateString()}</Typography>
                    </TableCell>
                    <TableCell width="5%">
                      <SearchIcon fontSize="small" />
                    </TableCell>
                  </TableRow>
                  {open && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                              <Typography variant="h6">
                                Basic details
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.name}
                                    fullWidth
                                    label="Product name"
                                    name="name"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.sku}
                                    disabled
                                    fullWidth
                                    label="SKU"
                                    name="sku"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.category}
                                    fullWidth
                                    label="Category"
                                    select
                                  >
                                    {categoryOptions.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.id}
                                    disabled
                                    fullWidth
                                    label="Barcode"
                                    name="barcode"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <Typography variant="h6">
                                Pricing and stocks
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.price}
                                    fullWidth
                                    label="Old price"
                                    name="old-price"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {product.currency}
                                        </InputAdornment>
                                      ),
                                    }}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.price}
                                    fullWidth
                                    label="New price"
                                    name="new-price"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          $
                                        </InputAdornment>
                                      ),
                                    }}
                                    type="number"
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={6}
                                  xs={12}
                                  sx={{
                                    alignItems: "center",
                                    display: "flex",
                                  }}
                                >
                                  <Switch />
                                  <Typography variant="subtitle2">
                                    Keep selling when stock is empty
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            px: 2,
                            py: 1,
                          }}
                        >
                          <Button
                            onClick={handleUpdateProduct}
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            sx={{ m: 1 }}
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleDeleteProduct}
                            color="error"
                            sx={{
                              m: 1,
                              ml: "auto",
                            }}
                          >
                            Delete product
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
