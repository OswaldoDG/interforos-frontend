import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { AuthorProfileComponent } from './components/pages/author-profile/author-profile.component';
import { BlogDetailsComponent } from './components/pages/blog-details/blog-details.component';
import { BlogGridComponent } from './components/pages/blog-grid/blog-grid.component';
import { BlogRightSidebarComponent } from './components/pages/blog-right-sidebar/blog-right-sidebar.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { CategoriesComponent } from './components/pages/categories/categories.component';
import { CheckoutComponent } from './components/pages/checkout/checkout.component';
import { ComingSoonComponent } from './components/pages/coming-soon/coming-soon.component';
import { ConfirmacionComponent } from './components/pages/confirmacion/confirmacion/confirmacion.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { DashboardAddListingsComponent } from './components/pages/dashboard/dashboard-add-listings/dashboard-add-listings.component';
import { DashboardBookingsComponent } from './components/pages/dashboard/dashboard-bookings/dashboard-bookings.component';
import { DashboardBookmarksComponent } from './components/pages/dashboard/dashboard-bookmarks/dashboard-bookmarks.component';
import { DashboardInvoiceComponent } from './components/pages/dashboard/dashboard-invoice/dashboard-invoice.component';
import { DashboardMessagesComponent } from './components/pages/dashboard/dashboard-messages/dashboard-messages.component';
import { DashboardMyListingsComponent } from './components/pages/dashboard/dashboard-my-listings/dashboard-my-listings.component';
import { DashboardMyProfileComponent } from './components/pages/dashboard/dashboard-my-profile/dashboard-my-profile.component';
import { DashboardReviewsComponent } from './components/pages/dashboard/dashboard-reviews/dashboard-reviews.component';
import { DashboardWalletComponent } from './components/pages/dashboard/dashboard-wallet/dashboard-wallet.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { EventsDetailsComponent } from './components/pages/events-details/events-details.component';
import { EventsComponent } from './components/pages/events/events.component';
import { FaqComponent } from './components/pages/faq/faq.component';
import { GaleriaModelComponent } from './components/pages/galeria-model/galeria-model.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { GridListingsFullWidthComponent } from './components/pages/grid-listings-full-width/grid-listings-full-width.component';
import { GridListingsLeftSidebarComponent } from './components/pages/grid-listings-left-sidebar/grid-listings-left-sidebar.component';
import { GridListingsRightSidebarComponent } from './components/pages/grid-listings-right-sidebar/grid-listings-right-sidebar.component';
import { HomeDemoTwoComponent } from './components/pages/home-demo-two/home-demo-two.component';
import { HomePromodelComponent } from './components/pages/home-promodel/home-promodel.component';
import { HowItWorksPageComponent } from './components/pages/how-it-works-page/how-it-works-page.component';
import { ListingsDetailsComponent } from './components/pages/listings-details/listings-details.component';
import { ModelComponent } from './components/pages/model/model.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { PaginaAdminProyectosComponent } from './components/pages/pagina-admin-proyectos/pagina-admin-proyectos.component';
import { PerfilPersonaComponent } from './components/pages/perfil-persona/perfil-persona.component';
import { PricingComponent } from './components/pages/pricing/pricing.component';
import { ProductsDetailsComponent } from './components/pages/products-details/products-details.component';
import { ProductsListComponent } from './components/pages/products-list/products-list.component';
import { PromodelStaffComponent } from './components/pages/promodel-staff/promodel-staff.component';
import { TopPlaceComponent } from './components/pages/top-place/top-place.component';
import { VerticalListingsFullWidthComponent } from './components/pages/vertical-listings-full-width/vertical-listings-full-width.component';
import { VerticalListingsLeftSidebarComponent } from './components/pages/vertical-listings-left-sidebar/vertical-listings-left-sidebar.component';
import { VerticalListingsRightSidebarComponent } from './components/pages/vertical-listings-right-sidebar/vertical-listings-right-sidebar.component';
import { UserGuard } from './services/guards/user-guard';
import { PaginaEditorCastingComponent } from './components/pages/pagina-editor-casting/pagina-editor-casting.component';
import { HomeCastingViewComponent } from './components/pages/home-demo-two/home-casting-view/home-casting-view.component';
import { RecuperarPasswordComponent } from './components/pages/recuperar-password/recuperar-password.component';
import { CastigReviewComponent } from './components/pages/castig-review/castig-review.component';
import { StaffGuard } from './services/guards/staff-guard';
import { AdminGuard } from './services/guards/admin-guard';
import { RevisorGuard } from './services/guards/revisor-guard';
import { ModeloGuard } from './services/guards/modelo-guard';
import { SinAccesoComponent } from './components/pages/sin-acceso/sin-acceso.component';
import { VotoModeloComponentComponent } from './components/pages/voto-modelo-component/voto-modelo-component.component';
import { PerfilColaboradorComponent } from './components/common/perfil-colaborador/perfil-colaborador.component';
import { RegistroPersonasComponent } from './components/common/registro-personas/registro-personas.component';
import { InvitarAgenteComponent } from './components/common/invitar-agente/invitar-agente.component';

const routes: Routes = [
  { path: '', component: HomePromodelComponent },
  {
    path: 'staff',
    component: PromodelStaffComponent,
    canActivate: [StaffGuard],
  },
  {
    path: 'castings',
    component: PaginaAdminProyectosComponent,
    canActivate: [StaffGuard],
  },
  { path: 'castings/:id', component: PaginaEditorCastingComponent },
  { path: 'castings/', component: PaginaEditorCastingComponent },
  { path: 'model', component: ModelComponent, canActivate: [ModeloGuard] },
  {
    path: 'perfil',
    component: PerfilPersonaComponent,
    canActivate: [ModeloGuard],
  },
  {
    path: 'galeria',
    component: GaleriaModelComponent,
    canActivate: [ModeloGuard],
  },
  { path: 'confirmacion/:id', component: ConfirmacionComponent },
  { path: 'password/:id', component: RecuperarPasswordComponent },
  { path: 'index-2', component: HomeDemoTwoComponent },
  { path: 'about', component: AboutUsComponent },
  { path: 'how-it-works', component: HowItWorksPageComponent },
  { path: 'pricing', component: PricingComponent, canActivate: [UserGuard] },
  { path: 'gallery', component: GalleryComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'blog-grid', component: BlogGridComponent },
  { path: 'blog-right-sidebar', component: BlogRightSidebarComponent },
  { path: 'blog-details', component: BlogDetailsComponent },
  { path: 'products-list', component: ProductsListComponent },
  { path: 'cart', component: CartComponent, canActivate: [AdminGuard] },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'single-products', component: ProductsDetailsComponent },
  { path: 'user-profile', component: AuthorProfileComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'destinations', component: TopPlaceComponent },
  { path: 'casting/:id/actual', component: HomeCastingViewComponent },
  {
    path: 'casting/:id',
    component: CastigReviewComponent,
    canActivate: [RevisorGuard, StaffGuard],
  },
  {
    path: 'staff/perfil',
    component: PerfilColaboradorComponent,
  },
  {
    path: 'revisor/perfil',
    component: PerfilColaboradorComponent,
  },
  {
    path: 'admin/perfil',
    component: PerfilColaboradorComponent,
  },
  {
    path: '401',
    component: SinAccesoComponent,
  },
  {
    path: 'mismodelos',
    component: RegistroPersonasComponent,
  },
  {
    path: 'vertical-listings-left-sidebar',
    component: VerticalListingsLeftSidebarComponent,
  },
  {
    path: 'vertical-listings-right-sidebar',
    component: VerticalListingsRightSidebarComponent,
  },
  {
    path: 'vertical-listings-full-width',
    component: VerticalListingsFullWidthComponent,
  },
  {
    path: 'grid-listings-left-sidebar',
    component: GridListingsLeftSidebarComponent,
  },
  {
    path: 'grid-listings-right-sidebar',
    component: GridListingsRightSidebarComponent,
  },
  {
    path: 'grid-listings-full-width',
    component: GridListingsFullWidthComponent,
  },
  { path: 'single-listings', component: ListingsDetailsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'single-events', component: EventsDetailsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard-messages', component: DashboardMessagesComponent },
  { path: 'dashboard-bookings', component: DashboardBookingsComponent },
  { path: 'dashboard-wallet', component: DashboardWalletComponent },
  { path: 'dashboard-reviews', component: DashboardReviewsComponent },
  { path: 'dashboard-invoice', component: DashboardInvoiceComponent },
  { path: 'dashboard-my-profile', component: DashboardMyProfileComponent },
  { path: 'dashboard-add-listings', component: DashboardAddListingsComponent },
  { path: 'dashboard-bookmarks', component: DashboardBookmarksComponent },
  { path: 'dashboard-my-listings', component: DashboardMyListingsComponent },
  { path: 'voto-modelo-component', component: VotoModeloComponentComponent },
  { path: 'staff/invitaragente', component: InvitarAgenteComponent },
  // Here add new pages component

  { path: '**', component: NotFoundComponent }, // This line will remain down from the whole pages component list
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],

  exports: [RouterModule],
})
export class AppRoutingModule {}
