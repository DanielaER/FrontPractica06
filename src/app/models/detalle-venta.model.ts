export class DetalleVenta {
    venta: number;  // ID de la venta
    producto: number;  // ID del producto
    cantidad: number;  // Cantidad de productos
    precio: number;  // Precio unitario del producto
  
    // Constructor para inicializar el modelo
    constructor(
      venta: number = 0,
      producto: number = 0,
      cantidad: number = 0,
      precio: number = 0
    ) {
      this.venta = venta;
      this.producto = producto;
      this.cantidad = cantidad;
      this.precio = precio;
    }
  
    // Método para calcular el total de la venta (cantidad * precio)
    calcularTotal(): number {
      return this.cantidad * this.precio;
    }
  }
  