import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// PrimeNG
// PrimeNG
import { CarouselModule } from 'primeng/carousel';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';

// Services & Models
import { PlafondService } from '../../core/services/plafond.service';
import { Plafond } from '../../core/models/plafond.model';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

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
    AvatarModule,
    ImageModule
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {
  private plafondService = inject(PlafondService);
  private productService = inject(ProductService);

  plafonds = signal<Plafond[]>([]);
  products = signal<Product[]>([]);
  selectedPlafond = signal<Plafond | null>(null);

  // Filtered products based on selected plafond
  filteredProducts = computed(() => {
    const selected = this.selectedPlafond();
    if (!selected) return [];
    return this.products()
      .filter(p => p.plafond.id === selected.id)
      .sort((a, b) => a.tenor - b.tenor);
  });

  carouselItems = [
    {
      title: 'Pinjaman Cepat & Transparan',
      description: 'Dapatkan dana darurat atau modal usaha dengan proses 100% online.',
      image: '/wallet-card.webp', // Financial growth
    },
    {
      title: 'Bunga Rendah, Tenor Fleksibel',
      description: 'Pilihan tenor hingga 12 bulan dengan suku bunga kompetitif.',
      image: '/money-calc.webp', // Calculator/Money
    },
    {
      title: 'Terdaftar & Diawasi oleh OJK',
      description: 'Privasi data dan kenyamanan Anda adalah prioritas utama kami.',
      image: '/office-calc.webp', // Modern office/Team
    }
  ];

  loanSteps = [
    {
      icon: 'pi pi-mobile',
      title: 'Download & Registrasi',
      description: 'Unduh aplikasi Fintar dan daftarkan akun Anda hanya dalam 2 menit.'
    },
    {
      icon: 'pi pi-id-card',
      title: 'Lengkapi Data',
      description: 'Isi data diri dan upload dokumen yang diperlukan (KTP & NPWP).'
    },
    {
      icon: 'pi pi-wallet',
      title: 'Pilih Pinjaman',
      description: 'Pilih jumlah plafond dan tenor yang sesuai dengan kebutuhan Anda.'
    },
    {
      icon: 'pi pi-check-circle',
      title: 'Verifikasi & Cair',
      description: 'Data diverifikasi otomatis, dan dana langsung cair ke rekening Anda.'
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

  testimonials = [
    {
      name: 'Budi Santoso',
      role: 'Wiraswasta',
      message: 'Prosesnya sangat cepat, dana cair dalam hitungan jam. Sangat membantu untuk modal usaha saya.',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      name: 'Siti Aminah',
      role: 'Ibu Rumah Tangga',
      message: 'Aplikasi mudah digunakan, bunganya juga terjangkau. Terima kasih Fintar!',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      name: 'Rudi Hermawan',
      role: 'Karyawan Swasta',
      message: 'Solusi tepat saat butuh dana mendesak. Syaratnya tidak ribet dan transparan.',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      name: 'Dewi Kartika',
      role: 'Pedagang Online',
      message: 'Customer service sangat ramah dan membantu. Pengalaman meminjam yang menyenangkan.',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
    },
    {
      name: 'Agus Pratama',
      role: 'Driver Ojol',
      message: 'Sangat terbantu dengan Fintar. Tenor fleksibel jadi angsuran tidak memberatkan.',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    }
  ];

  ngOnInit(): void {
    this.loadPlafonds();
    this.loadProducts();
  }

  loadPlafonds(): void {
    this.plafondService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Sort by maxAmount ascending (smallest first)
          const sortedData = res.data.sort((a, b) => a.maxAmount - b.maxAmount);
          this.plafonds.set(sortedData.slice(0, 4)); // Get top 4 for display
        }
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products.set(res.data);
        }
      }
    });
  }

  onSelectPlafond(plafond: Plafond): void {
    this.selectedPlafond.set(plafond);
    setTimeout(() => {
      this.scrollToSection('selected-products');
    }, 100);
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
