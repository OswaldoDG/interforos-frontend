import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

export interface Video {
  titulo: string;
  link: string;
  codigoEmbed?: string;
  safeContent?: SafeResourceUrl;
  fuente: 'youtube' | 'instagram' | 'unknown';
  thumbnailUrl?: string;
}

@Component({
  selector: 'app-pagina-videos',
  templateUrl: './pagina-videos.component.html',
  styleUrls: ['./pagina-videos.component.scss']
})
export class PaginaVideosComponent implements OnInit, OnDestroy {

  videos: Video[] = [];
  modalRef?: BsModalRef;
  videoActivoYoutubeUrl?: SafeResourceUrl;
  videoActivoInstagramEmbedCode?: string;
  videoActivoTitulo: string = '';
  videoActivoFuente?: 'youtube' | 'instagram' | 'unknown';

  private modalSub?: Subscription;

  constructor(
    private http: HttpClient,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cargarVideos();
  }

  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }

  openVideo(video: Video, modalTemplate: TemplateRef<any>) {
    this.videoActivoYoutubeUrl = undefined;
    this.videoActivoInstagramEmbedCode = undefined;
    this.videoActivoTitulo = video.titulo;
    this.videoActivoFuente = video.fuente;

    const modalConfig = {
      class: 'modal-lg'
    };

    this.modalRef = this.modalService.show(modalTemplate, modalConfig);

    if (video.fuente === 'instagram' && video.codigoEmbed) {
      this.videoActivoInstagramEmbedCode = video.codigoEmbed;

      setTimeout(() => {
        const instagramContainer = document.getElementById('instagram-embed-content');
        const spinnerContainer = document.getElementById('instagram-spinner-container');

        if (instagramContainer && spinnerContainer && this.videoActivoInstagramEmbedCode) {
          instagramContainer.innerHTML = this.videoActivoInstagramEmbedCode;
          (window as any).instgrm?.Embeds.process();

          setTimeout(() => {
            if (spinnerContainer && instagramContainer) {
              spinnerContainer.style.display = 'none';
              instagramContainer.style.visibility = 'visible';
            }
          }, 3500);
        }
      }, 50);

    } else if (video.fuente === 'youtube' && video.safeContent) {
      this.videoActivoYoutubeUrl = video.safeContent;
    }
  }

  private extractYouTubeId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  cargarVideos() {
    this.http.get<Video[]>('assets/video/videos.json').pipe(
      map(videos => videos.map(video => {
        const newVideo: Video = { ...video };
        if (newVideo.link.includes('youtube.com') || newVideo.link.includes('youtu.be')) {
          newVideo.fuente = 'youtube';
          const videoId = this.extractYouTubeId(newVideo.link);
          if (videoId) {
            newVideo.safeContent = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
            newVideo.thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
        } else if (newVideo.link.includes('instagram.com')) {
          newVideo.fuente = 'instagram';
          if (video.thumbnailUrl) {
            newVideo.thumbnailUrl = video.thumbnailUrl;
          }
        } else {
          newVideo.fuente = 'unknown';
        }
        return newVideo;
      }))
    ).subscribe(videosProcesados => {
      this.videos = videosProcesados;
    });
  }
}
