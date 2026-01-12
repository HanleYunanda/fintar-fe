import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';

// Services & Models
import { PlafondService } from '../../core/services/plafond.service';
import { Plafond } from '../../core/models/plafond.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CarouselModule,
    AccordionModule,
    ButtonModule,
    CardModule,
    DividerModule,
    AvatarModule
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  private plafondService = inject(PlafondService);

  plafonds = signal<Plafond[]>([]);

  carouselItems = [
    {
      title: 'Pinjaman Cepat & Transparan',
      description: 'Dapatkan dana darurat atau modal usaha dengan proses 100% online.',
      image: 'https://images.unsplash.com/photo-1573163281534-dd0a844932d8?q=80&w=2070&auto=format&fit=crop', // Financial growth
    },
    {
      title: 'Bunga Rendah, Tenor Fleksibel',
      description: 'Pilihan tenor hingga 12 bulan dengan suku bunga kompetitif.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2111&auto=format&fit=crop', // Calculator/Money
    },
    {
      title: 'Terdaftar & Diawasi oleh OJK',
      description: 'Privasi data dan kenyamanan Anda adalah prioritas utama kami.',
      image: 'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop', // Modern office/Team
    }
  ];

  faqs = [
    {
      question: 'Apa saja syarat mengajukan pinjaman di Fintar?',
      answer: 'Cukup menyiapkan KTP, berstatus WNI usia 18-55 tahun, dan memiliki penghasilan tetap.'
    },
    {
      question: 'Berapa lama proses pencairan dana?',
      answer: 'Setelah aplikasi disetujui, dana akan dikirimkan ke rekening Anda dalam waktu kurang dari 24 jam.'
    },
    {
      question: 'Bagaimana cara membayar cicilan?',
      answer: 'Anda dapat membayar melalui Virtual Account (VA), m-Banking, atau toko retail seperti Alfamart dan Indomaret.'
    },
    {
      question: 'Apakah ada biaya tersembunyi?',
      answer: 'Tidak ada. Semua biaya administrasi dan bunga akan ditampilkan secara transparan di awal aplikasi.'
    }
  ];

  benefits = [
    { icon: 'pi pi-bolt', title: 'Approval Cepat', desc: 'Keputusan pinjaman hanya dalam hitungan menit.' },
    { icon: 'pi pi-shield', title: 'Aman & Resmi', desc: 'Data terenkripsi dan diawasi oleh otoritas terkait.' },
    { icon: 'pi pi-percentage', title: 'Bunga Kompetitif', desc: 'Bunga rendah mulai dari 0.1% per hari.' },
    { icon: 'pi pi-mobile', title: 'Full Online', desc: 'Ajuin dimana saja tanpa harus ke kantor.' }
  ];

  ngOnInit(): void {
    this.loadPlafonds();
  }

  loadPlafonds(): void {
    this.plafondService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.plafonds.set(res.data.slice(0, 4)); // Get top 4 for display
        }
      }
    });
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
