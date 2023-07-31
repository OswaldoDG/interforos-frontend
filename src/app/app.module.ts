import { BrowserModule } from '@angular/platform-browser';
import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeDemoOneComponent } from './components/pages/home-demo-one/home-demo-one.component';
import { HomeDemoTwoComponent } from './components/pages/home-demo-two/home-demo-two.component';
import { AppDownloadComponent } from './components/common/app-download/app-download.component';
import { HowItWorksComponent } from './components/common/how-it-works/how-it-works.component';
import { HomeoneBlogComponent } from './components/pages/home-demo-one/homeone-blog/homeone-blog.component';
import { FeedbackStyleOneComponent } from './components/common/feedback-style-one/feedback-style-one.component';
import { HomeoneDestinationsComponent } from './components/pages/home-demo-one/homeone-destinations/homeone-destinations.component';
import { CategoryComponent } from './components/common/category/category.component';
import { HomeoneListingsComponent } from './components/pages/home-demo-one/homeone-listings/homeone-listings.component';
import { FeaturesComponent } from './components/common/features/features.component';
import { HomeoneBannerComponent } from './components/pages/home-demo-one/homeone-banner/homeone-banner.component';
import { FooterStyleOneComponent } from './components/common/footer-style-one/footer-style-one.component';
import { NavbarStyleOneComponent } from './components/common/navbar-style-one/navbar-style-one.component';
import { NavbarStyleTwoComponent } from './components/common/navbar-style-two/navbar-style-two.component';
import { HometwoBannerComponent } from './components/pages/home-demo-two/hometwo-banner/hometwo-banner.component';
import { HometwoListingsComponent } from './components/pages/home-demo-two/hometwo-listings/hometwo-listings.component';
import { HometwoDestinationsComponent } from './components/pages/home-demo-two/hometwo-destinations/hometwo-destinations.component';
import { HometwoEventsComponent } from './components/pages/home-demo-two/hometwo-events/hometwo-events.component';
import { HometwoBlogComponent } from './components/pages/home-demo-two/hometwo-blog/hometwo-blog.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { PartnerComponent } from './components/common/partner/partner.component';
import { TeamComponent } from './components/common/team/team.component';
import { FunfactsComponent } from './components/common/funfacts/funfacts.component';
import { HowItWorksPageComponent } from './components/pages/how-it-works-page/how-it-works-page.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { FooterStyleTwoComponent } from './components/common/footer-style-two/footer-style-two.component';
import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
import { BlogRightSidebarComponent } from './components/pages/blog-right-sidebar/blog-right-sidebar.component';
import { BlogDetailsComponent } from './components/pages/blog-details/blog-details.component';
import { ProductsListComponent } from './components/pages/products-list/products-list.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ProductsDetailsComponent } from './components/pages/products-details/products-details.component';
import { RelatedProductsComponent } from './components/pages/products-details/related-products/related-products.component';
import { AuthorProfileComponent } from './components/pages/author-profile/author-profile.component';
import { CategoriesComponent } from './components/pages/categories/categories.component';
import { TopPlaceComponent } from './components/pages/top-place/top-place.component';
import { ListingsDetailsComponent } from './components/pages/listings-details/listings-details.component';
import { EventsDetailsComponent } from './components/pages/events-details/events-details.component';
import { EventsComponent } from './components/pages/events/events.component';
import { VerticalListingsLeftSidebarComponent } from './components/pages/vertical-listings-left-sidebar/vertical-listings-left-sidebar.component';
import { VerticalListingsRightSidebarComponent } from './components/pages/vertical-listings-right-sidebar/vertical-listings-right-sidebar.component';
import { VerticalListingsFullWidthComponent } from './components/pages/vertical-listings-full-width/vertical-listings-full-width.component';
import { GridListingsLeftSidebarComponent } from './components/pages/grid-listings-left-sidebar/grid-listings-left-sidebar.component';
import { GridListingsRightSidebarComponent } from './components/pages/grid-listings-right-sidebar/grid-listings-right-sidebar.component';
import { GridListingsFullWidthComponent } from './components/pages/grid-listings-full-width/grid-listings-full-width.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { DashboardNavbarComponent } from './components/common/dashboard-navbar/dashboard-navbar.component';
import { DashboardSidemenuComponent } from './components/common/dashboard-sidemenu/dashboard-sidemenu.component';
import { CopyrightsComponent } from './components/pages/dashboard/copyrights/copyrights.component';
import { StatsComponent } from './components/pages/dashboard/stats/stats.component';
import { RecentActivitiesComponent } from './components/pages/dashboard/recent-activities/recent-activities.component';
import { DashboardMessagesComponent } from './components/pages/dashboard/dashboard-messages/dashboard-messages.component';
import { DashboardBookingsComponent } from './components/pages/dashboard/dashboard-bookings/dashboard-bookings.component';
import { DashboardWalletComponent } from './components/pages/dashboard/dashboard-wallet/dashboard-wallet.component';
import { DashboardReviewsComponent } from './components/pages/dashboard/dashboard-reviews/dashboard-reviews.component';
import { DashboardInvoiceComponent } from './components/pages/dashboard/dashboard-invoice/dashboard-invoice.component';
import { DashboardMyProfileComponent } from './components/pages/dashboard/dashboard-my-profile/dashboard-my-profile.component';
import { DashboardAddListingsComponent } from './components/pages/dashboard/dashboard-add-listings/dashboard-add-listings.component';
import { DashboardBookmarksComponent } from './components/pages/dashboard/dashboard-bookmarks/dashboard-bookmarks.component';
import { DashboardMyListingsComponent } from './components/pages/dashboard/dashboard-my-listings/dashboard-my-listings.component';
import { AppConfigService } from './services/configuration/app-config.service';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { SessionService } from './state/session.service';
import { UserGuard } from './services/guards/user-guard';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HotToastModule } from '@ngneat/hot-toast';
import { API_BASE_URL } from './services/api/api-promodel';
import { environment } from 'src/environments/environment';
import { ConfirmacionComponent } from './components/pages/confirmacion/confirmacion/confirmacion.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BearerInterceptor } from './services/interceptors/bearer-interceptor';
import { PerfilPersonaComponent } from './components/pages/perfil-persona/perfil-persona.component';
import { OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ModelComponent } from './components/pages/model/model.component';
import { NavbarPromodelComponent } from './components/common/navbar-promodel/navbar-promodel.component';
import { HomePromodelComponent } from './components/pages/home-promodel/home-promodel.component';
import { GaleriaModelComponent } from './components/pages/galeria-model/galeria-model.component';
import { PersonaInfoComponent } from './components/common/persona-info/persona-info.component';
import { BuscarPersonaComponent } from './components/common/buscar-persona/buscar-persona.component';
import { PaginaBusquedaModelosComponent } from './components/pages/pagina-busqueda-modelos/pagina-busqueda-modelos.component';
import { PersonaCardComponent } from './components/common/persona-card/persona-card.component';
import { PaginadoPersonasComponent } from './components/common/paginado-personas/paginado-personas.component';
import { SecurePipe } from './pipes/SecurePipe ';
import { PromodelSidemenuComponent } from './components/common/promodel-sidemenu/promodel-sidemenu.component';
import { PromodelStaffComponent } from './components/pages/promodel-staff/promodel-staff.component';
import { NavbarStaffComponent } from './components/common/navbar-staff/navbar-staff.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginaAdminProyectosComponent } from './components/pages/pagina-admin-proyectos/pagina-admin-proyectos.component';
import { BuscarProyectoComponent } from './components/common/buscar-proyecto/buscar-proyecto.component';
import { DocumentoPersonaComponent } from './components/common/documento-persona/documento-persona.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { QuillModule } from 'ngx-quill';
import { AgGridModule } from 'ag-grid-angular';
import { EditorCastingComponent } from './components/common/editor-casting/editor-casting.component';
import { PaginaEditorCastingComponent } from './components/pages/pagina-editor-casting/pagina-editor-casting.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ContactosClienteComponent } from './components/common/contactos-cliente/contactos-cliente.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CategoriasCastingComponent } from './components/common/categorias-casting/categorias-casting.component';
import { BtnCloseRenderer } from './components/common/cells-render/btn-close-renderer.component';
import { BtnEditRenderer } from './components/common/cells-render/btn-edit-renderer.component';
import { EventosCastingComponent } from './components/common/eventos-casting/eventos-casting.component';
defineLocale('es', esLocale);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    SecurePipe,
    AppComponent,
    HomeDemoOneComponent,
    HomeDemoTwoComponent,
    AppDownloadComponent,
    HowItWorksComponent,
    HomeoneBlogComponent,
    FeedbackStyleOneComponent,
    HomeoneDestinationsComponent,
    CategoryComponent,
    HomeoneListingsComponent,
    FeaturesComponent,
    HomeoneBannerComponent,
    FooterStyleOneComponent,
    NavbarStyleOneComponent,
    NavbarStyleTwoComponent,
    HometwoBannerComponent,
    HometwoListingsComponent,
    HometwoDestinationsComponent,
    HometwoEventsComponent,
    HometwoBlogComponent,
    ComingSoonComponent,
    NotFoundComponent,
    AboutUsComponent,
    PartnerComponent,
    TeamComponent,
    FunfactsComponent,
    HowItWorksPageComponent,
    PricingComponent,
    GalleryComponent,
    FaqComponent,
    ContactComponent,
    FooterStyleTwoComponent,
    BlogGridComponent,
    BlogRightSidebarComponent,
    BlogDetailsComponent,
    ProductsListComponent,
    CartComponent,
    CheckoutComponent,
    ProductsDetailsComponent,
    RelatedProductsComponent,
    AuthorProfileComponent,
    CategoriesComponent,
    TopPlaceComponent,
    ListingsDetailsComponent,
    EventsDetailsComponent,
    EventsComponent,
    VerticalListingsLeftSidebarComponent,
    VerticalListingsRightSidebarComponent,
    VerticalListingsFullWidthComponent,
    GridListingsLeftSidebarComponent,
    GridListingsRightSidebarComponent,
    GridListingsFullWidthComponent,
    DashboardComponent,
    DashboardNavbarComponent,
    DashboardSidemenuComponent,
    CopyrightsComponent,
    StatsComponent,
    RecentActivitiesComponent,
    DashboardMessagesComponent,
    DashboardBookingsComponent,
    DashboardWalletComponent,
    DashboardReviewsComponent,
    DashboardInvoiceComponent,
    DashboardMyProfileComponent,
    DashboardAddListingsComponent,
    DashboardBookmarksComponent,
    DashboardMyListingsComponent,
    ConfirmacionComponent,
    PerfilPersonaComponent,
    ModelComponent,
    NavbarPromodelComponent,
    HomePromodelComponent,
    GaleriaModelComponent,
    PersonaInfoComponent,
    BuscarPersonaComponent,
    PaginaBusquedaModelosComponent,
    PersonaCardComponent,
    PaginadoPersonasComponent,
    PromodelSidemenuComponent,
    PromodelStaffComponent,
    NavbarStaffComponent,
    PaginaAdminProyectosComponent,
    BuscarProyectoComponent,
    DocumentoPersonaComponent,
    EditorCastingComponent,
    PaginaEditorCastingComponent,
    ContactosClienteComponent,
    CategoriasCastingComponent,
    BtnCloseRenderer,
    BtnEditRenderer,
    EventosCastingComponent,
  ],
  imports: [
    AlertModule,
    TypeaheadModule.forRoot(),
    AgGridModule,
    QuillModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule,
    TabsModule.forRoot(),
    NgImageSliderModule,
    OwlDateTimeModule,
    NgMultiSelectDropDownModule.forRoot(),
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CarouselModule,
    SelectDropDownModule,
    NgxTypedJsModule,
    FormsModule,
    NgxPaginationModule,
    HttpClientModule,
    HotToastModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'es-mx',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiRoot },
    { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true },
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'es-MX'},
    UserGuard,
    BsModalService,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (myInitService: AppConfigService) => () =>
        myInitService.load(),
      deps: [AppConfigService, SessionService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
