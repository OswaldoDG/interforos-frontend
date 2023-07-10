import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CastingClient } from 'src/app/services/api/api-promodel';

@Component({
  selector: 'app-contactos-cliente',
  templateUrl: './contactos-cliente.component.html',
  styleUrls: ['./contactos-cliente.component.scss']
})
export class ContactosClienteComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() Casting : string = null;


  // Especifica si hay un contacto seleccionado del typeahead
  private contactoExistente: boolean =  false;

  // Es esta variable se guardan todos los contactos del cliente, en el typeahead se filtran por email
  private contactosCliente: any[] = [];

  // En esta variabl se llenan los contactos seleccionados 
  private contactosCasting: any[] = [];

  constructor(private clientApi: CastingClient) { }


  ngAfterViewInit(): void {
    // leer aqui los contactos del cliente con clientApi 
    // almacenarlos en this.contactosCliente
    // y utlizarlos para el typeahead
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
      console.log("Nuevos datos de casting");
      console.log(changes);
      this.procesarCambios();
  }

  private procesarCambios() {
    if(this.Casting) {
        // Casting es nulo, 0 o undefined por lo tanto casting nuevo
    } else {
        // Casting NO es nulo por lo tanto casting existemte
        
        // llenar la variable contactosCasting con los contactos 
        // Comparando 
    }0
  }


  // REaliza una actualización de los contactos al backend utilizando la proiedad casting y la lista de contactosCliente
  public actualizarContactos() {
    // Aqui va ir la llamda a la api
  }

}
